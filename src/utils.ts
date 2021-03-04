export const debounce = (func: Function, delay: number) => {
  let timer: number;

  return function(this: object) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clearTimeout(timer);
    timer = window.setTimeout(() => func.apply(context, args), delay);
  };
};
