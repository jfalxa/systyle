export function addAnimation(nextAnimation: string) {
  return ({ animation = '', animations = [], ...props }) => ({
    ...props,
    animations: [...animations, nextAnimation.trim(), animation].filter(Boolean)
  })
}

export function combineAnimations({ animations = [], ...props }) {
  return { ...props, animation: animations.join() }
}
