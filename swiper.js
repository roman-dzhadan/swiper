import { Card } from './card.js';

export class Swiper {
  #swiper = document.querySelector('#swiper');
  appendNewCard() {
    const card = new Card({
      imageUrls: [
        'https://source.unsplash.com/random/1000x1000/?sky',
        'https://source.unsplash.com/random/1000x1000/?landscape',
        'https://source.unsplash.com/random/1000x1000/?ocean',
        'https://source.unsplash.com/random/1000x1000/?moutain',
        'https://source.unsplash.com/random/1000x1000/?forest'
      ].sort(() => Math.random() - 0.5),
      onDismiss: () => { }, // () => setTimeout(() => this.appendNewCard(), 1000),
      onDislike: () => {
        console.log('add to local storage the person you disliked');
      },
      onSuperlike: () => {
        console.log('add to local storage the person you superliked');
      },
      onLike: () => {
        console.log('add to local storage the person you liked');
      }
    });
    this.#swiper.append(card.element);
    const cards = this.#swiper.querySelectorAll('.card:not(.dismissing)');
    cards.forEach((card, index) => {
      card.style.setProperty('--i', index);
    });
    return this;
  }
}