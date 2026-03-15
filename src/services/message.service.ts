import {
  useMessageStore,
  type MessageType,
  type MessageIcons,
} from "~/store/messageStore";

export interface MessageOptions {
  timeout?: number;
  prependIcon?: MessageIcons;
}

class MessageService {
  count: number;

  constructor() {
    this.count = 0;
  }

  get store() {
    return useMessageStore();
  }

  get messages() {
    return this.store.messages;
  }

  set messages(value) {
    this.store.messages = value;
  }

  private notify(type: MessageType, text: string, options?: MessageOptions) {
    this.store.enqueue({
      text,
      color: type,
      prependIcon: options?.prependIcon,
      timeout: options?.timeout ?? 2000,
      zIndex: ++this.count
    });
  }

  success(text: string, options?: MessageOptions) {
    this.notify("success", text, options);
  }

  error(text: string, options?: MessageOptions) {
    this.notify("error", text, options);
  }

  warning(text: string, options?: MessageOptions) {
    this.notify("warning", text, options);
  }

  info(text: string, options?: MessageOptions) {
    this.notify("info", text, options);
  }

  clear(): void {
    this.store.clear();
  }

  queue(text: string, task: Promise<void>) {
    this.store.enqueueAsync({
        text: `正在 ${text}`,
        promise: task,
        success: () => ({
            text: `${text} 成功`,
            color: "success",
            prependIcon: "$success",
        }),
        error: (e) => ({
            text: `${text} 失败: ${e.message}`,
            color: "error",
            prependIcon: "$error",
        }),
        zIndex: ++this.count
    });
  }
}

const appMessage = new MessageService();

export default appMessage;
