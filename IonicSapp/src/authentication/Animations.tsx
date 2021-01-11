import { createAnimation } from '@ionic/react';

export const groupLoginAnimations = () => {
    const elB = document.querySelector('.label1');
    const elC = document.querySelector('.label2');
    if (elB && elC) {
        const animationA = createAnimation()
            .addElement(elB)
            .fromTo('transform', 'scale(0.5)', 'scale(1.5)');
        const animationB = createAnimation()
            .addElement(elC)
            .fromTo('transform', 'scale(0.5)', 'scale(1.5)');
        const parentAnimation = createAnimation()
            .duration(5000)
            .addAnimation([animationA, animationB]);
        parentAnimation.play();    }
}

export const titleAnimation = () => {
    const el = document.querySelector('.title');
    if (el) {
        const animation = createAnimation()
            .addElement(el)
            .duration(1000)
            .direction('alternate')
            .iterations(Infinity)
            .keyframes([
                { offset: 0, transform: 'scale(2)', opacity: '1' },
                {
                    offset: 1, transform: 'scale(1.5)', opacity: '0.5'
                }
            ]);
        animation.play();
    }
}

export const chainAnimations = () => {
    const status = document.querySelector('.status');
    const button = document.querySelector('.button');
    if (status && button) {
        const animationA = createAnimation()
            .addElement(status)
            .duration(5000)
            .fromTo('transform', 'scale(1)', 'scale(2.5)');
        const animationB = createAnimation()
            .addElement(button)
            .duration(3000)
            .fromTo('transform', 'scale(2)', 'scale(1)');
        (async () => {
            await animationB.play();
            await animationA.play();
        })();
    }
}
