import { defineStore } from "pinia";
import { ref } from "vue";

export type MessageType = "success" | "error" | "warning" | "info";
export type MessageIcons = "$error" | "$success" | "$warning" | "$info";

export interface MessageBase {
  text: string;
  zIndex?: number;
}

export interface MessagePayload extends MessageBase {
  color: MessageType;
  timeout?: number;
  prependIcon?: MessageIcons;
}

export interface AsyncMessagePayload extends MessageBase {
  promise: Promise<void>;
  success?: () => MessagePayload ;
  error?: (e: Error) => MessagePayload ;
}

export const useMessageStore = defineStore("message", () => {
  const messages = ref<MessageBase[]>([]);

  function enqueue(payload: MessagePayload) {
    messages.value.push(payload);
  }

  function clear(): void {
    messages.value = [];
  }

  async function enqueueAsync(payload: AsyncMessagePayload)  {
    messages.value.push(payload);
  }

  return {
    messages,
    clear,
    enqueue,
    enqueueAsync,
  };
});
