declare global {
  interface Window {
    acee_this_is_not_bonus_function: () => void;
  }
}

export function registerBonusDebugHook(): void {
  window.acee_this_is_not_bonus_function = () => {
    console.log("1033703195");
    console.info("上面的数字是什么，好难猜呀");
  };
}

export const useBonus = registerBonusDebugHook;
