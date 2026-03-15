import "@/style/entry.scss";

const sepTime = 200;
const defaultDuration = 500;

export function entry(way: string, element: HTMLElement, sep: number = sepTime, callback?: () => void): void {
  const children = element.children;
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i] as HTMLElement;
    child.style.transition = "0s";
    child.classList.add(`entry-${way}`);
    setTimeout(() => {
      child.style.transition = `${defaultDuration / 1000}s`;
      child.classList.remove(`entry-${way}`);
    }, (i + 1) * sep);
  }

  if (typeof callback === "function") {
    setTimeout(callback, children.length * sep + 500);
  }
}

export function leave(way: string, element: HTMLElement, sep: number = sepTime, callback?: () => void): void {
  const children = element.children;
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i] as HTMLElement;
    setTimeout(() => {
      child.style.transition = `${defaultDuration / 1000}s`;
      child.classList.add(`entry-${way}`);
    }, (children.length - i) * sep);
  }

  if (typeof callback === "function") {
    setTimeout(callback, children.length * sep + 500);
  }
}

export function fadeOut(element: HTMLElement, duration: number = defaultDuration, callback?: () => void): void {
  element.style.transition = `${duration / 1000}s`;
  element.style.opacity = "0";
  if (typeof callback === "function") {
    setTimeout(callback, duration);
  }
}

export function fadeIn(element: HTMLElement, duration: number = defaultDuration, callback?: () => void): void {
  element.style.transition = `${duration / 1000}s`;
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.opacity = "1";
    if (typeof callback === "function") {
      setTimeout(callback, duration);
    }
  }, 0);
}
