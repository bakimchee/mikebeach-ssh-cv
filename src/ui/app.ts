import blessed from "blessed";
import type { ServerChannel } from "ssh2";
import { sendContactMessage } from "../contact/sendMessage";
import { aboutText, contactInfoText, educationText, experienceText, projectsText, skillsText } from "./sections";

export interface PtyInfo {
  term: string;
  rows: number;
  cols: number;
}

const MENU_ITEMS = ["About", "Experience", "Projects", "Skills", "Education", "Contact", "Quit"] as const;

/**
 * Wires a blessed TUI to an ssh2 shell channel. `stream` is the ssh2 Channel —
 * it's a duplex stream, so it doubles as blessed's input and output.
 */
export function startTuiApp(stream: ServerChannel, pty: PtyInfo, visitorIp: string): void {
  // Every SSH client that matters speaks UTF-8; without this, blessed's terminfo
  // detection routes non-ASCII characters (em dashes, curly quotes, …) through an
  // ASCII-only translation table and silently drops anything it can't map to '?'.
  const program = blessed.program({
    input: stream,
    output: stream,
    terminal: pty.term || "xterm-256color",
    forceUnicode: true,
  });
  program.rows = pty.rows;
  program.cols = pty.cols;

  const screen = blessed.screen({
    program,
    smartCSR: true,
    title: "mikebeach.co.uk",
    autoPadding: true,
    fullUnicode: true,
  });

  const menu = blessed.list({
    parent: screen,
    label: " menu ",
    left: 0,
    top: 0,
    width: "25%",
    height: "100%",
    border: "line",
    keys: true,
    vi: true,
    mouse: true,
    items: [...MENU_ITEMS],
    style: {
      selected: { bold: true, inverse: true },
      border: { fg: "grey" },
    },
  });

  const content = blessed.box({
    parent: screen,
    label: " mikebeach.co.uk ",
    left: "25%",
    top: 0,
    width: "75%",
    height: "100%",
    border: "line",
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
    mouse: true,
    style: { border: { fg: "grey" } },
  });

  function showSection(name: (typeof MENU_ITEMS)[number]): void {
    switch (name) {
      case "About":
        content.setContent(aboutText());
        screen.render();
        return;
      case "Experience":
        content.setContent(experienceText());
        screen.render();
        return;
      case "Projects":
        content.setContent(projectsText());
        screen.render();
        return;
      case "Skills":
        content.setContent(skillsText());
        screen.render();
        return;
      case "Education":
        content.setContent(educationText());
        screen.render();
        return;
      case "Contact":
        showContactForm();
        return;
      case "Quit":
        screen.destroy();
        stream.exit(0);
        stream.end();
        return;
    }
  }

  function showContactForm(): void {
    content.setContent(contactInfoText());

    // Single-line textboxes chained via blessed's built-in Enter-to-submit
    // behaviour (Textbox emits "submit" on Enter). Deliberately not using Tab
    // to move focus, and not blessed.form — both interact badly with
    // Input's readInput()/inputOnFocus keypress handling.
    blessed.text({ parent: content, top: 6, left: 1, content: "Name (Enter to continue):" });
    const nameInput = blessed.textbox({
      parent: content,
      top: 7,
      left: 1,
      width: "95%-2",
      height: 1,
      inputOnFocus: true,
      style: { fg: "white", bg: "blue" },
    });

    blessed.text({ parent: content, top: 9, left: 1, content: "Message (Enter to send):" });
    const messageInput = blessed.textbox({
      parent: content,
      top: 10,
      left: 1,
      width: "95%-2",
      height: 1,
      inputOnFocus: true,
      style: { fg: "white", bg: "blue" },
    });

    const status = blessed.text({ parent: content, top: 12, left: 1, content: "", tags: true });

    function send(name: string, message: string): void {
      if (!name.trim() || !message.trim()) {
        status.setContent("{red-fg}Name and message are both required.{/red-fg}");
        screen.render();
        nameInput.clearValue();
        messageInput.clearValue();
        nameInput.focus();
        return;
      }
      status.setContent("Sending…");
      screen.render();
      sendContactMessage({ name: name.trim(), message: message.trim(), visitorIp })
        .then(() => {
          status.setContent("{green-fg}Sent — thanks, I'll get back to you.{/green-fg}");
          nameInput.clearValue();
          messageInput.clearValue();
          screen.render();
        })
        .catch((err: Error) => {
          // The box parses tags, so an error message containing braces (a
          // Resend API payload, say) would be read as markup and swallowed.
          status.setContent(`{red-fg}Failed to send: ${blessed.escape(err.message)}{/red-fg}`);
          screen.render();
        });
    }

    nameInput.on("submit", () => messageInput.focus());
    messageInput.on("submit", () => send(nameInput.getValue(), messageInput.getValue()));

    nameInput.focus();
    screen.render();
  }

  menu.on("select", (item) => {
    const label = item.getText() as (typeof MENU_ITEMS)[number];
    showSection(label);
  });

  screen.key(["C-c"], () => {
    screen.destroy();
    stream.exit(0);
    stream.end();
  });

  menu.focus();
  showSection("About");
  screen.render();
}
