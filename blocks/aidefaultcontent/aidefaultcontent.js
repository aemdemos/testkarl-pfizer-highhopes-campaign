export default function decorate(block) {
  const variants = block.className
    .replace('block', '')
    .replace('aidefaultcontent', '')
    .trim();

  if (variants) {
    variants.split(/\s+/).forEach((cls) => {
      block.parentElement.classList.add(cls);
    });
  }
}
