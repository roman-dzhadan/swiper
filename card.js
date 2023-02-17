export class Card {

  #SHIFT = 50;
  #MODE = Object.freeze({
    THINKING: 'thinking',
    DISLIKE: 'dislike',
    SUPERLIKE: 'superlike',
    LIKE: 'like'
  });

  constructor({ imageUrls, onDismiss, onLike, onSuperlike, onDislike }) {
    this.imageUrls = imageUrls;
    this.imageIndex = 0;
    this.onDismiss = onDismiss;
    this.onLike = onLike;
    this.onSuperlike = onSuperlike;
    this.onDislike = onDislike;
    this.mode = this.#MODE.THINKING;
    this.element = this.#buildCard();
    this.#listenToMouseEvents();
  }

  #swipeStartPoint;
  #cardImagePanes;
  #cardImage;
  #cardImageIndicators;
  #dislikeSpan;
  #superlikeSpan;
  #likeSpan;

  #buildCard = () => {
    const cardDiv = this.#createCardDiv();
    this.#cardImagePanes = this.#createCardImagePanes();
    this.#cardImage = this.#createCardImage();
    this.#cardImageIndicators = this.#createCardImageIndicators();
    this.#dislikeSpan = this.#createDislikeSpan();
    this.#superlikeSpan = this.#createSuperlikeSpan();
    this.#likeSpan = this.#createLikeSpan();
    cardDiv.append(this.#cardImagePanes);
    cardDiv.append(this.#cardImage);
    cardDiv.append(this.#cardImageIndicators);
    cardDiv.append(this.#dislikeSpan);
    cardDiv.append(this.#superlikeSpan);
    cardDiv.append(this.#likeSpan);
    return cardDiv;
  }

  #createCardDiv() {
    const card = document.createElement('div');
    card.classList.add('card');
    return card;
  }

  #createCardImage() {
    const image = document.createElement('img');
    image.src = this.imageUrls[0];
    image.setAttribute('data-card-image-index', 0);
    return image;
  }

  #createCardImageIndicators = () => {
    const cardImageIndicators = document.createElement('div');
    cardImageIndicators.classList.add('card-image-indicators');
    this.imageUrls.map((_, index) => {
      const button = document.createElement('button')
      button.classList.add('card-image-indicator');
      button.setAttribute('data-card-image-index', index);
      if (index === 0) {
        button.classList.add('card-image-active-indicator');
      }
      button.addEventListener('click', (e) => {
        const newCardImageIndex = e.target.getAttribute('data-card-image-index');
        this.#setupCardImage(newCardImageIndex);
        e.stopPropagation();
      });
      cardImageIndicators.append(button)
    });
    return cardImageIndicators;
  };

  #switchToThePreviousCardImage = () => {
    const currentCardImageIndex = Number(this.#cardImage.getAttribute('data-card-image-index'));
    if (currentCardImageIndex === 0) {
      this.element.parentNode.classList.add('swiper-left-dead-end');
      setTimeout(() => {
        this.element.parentNode.classList.remove('swiper-left-dead-end');
      }, 333);
    } else {
      this.#setupCardImage(currentCardImageIndex - 1);
    }
  };

  #switchToTheNextCardImage = () => {
    const currentCardImageIndex = Number(this.#cardImage.getAttribute('data-card-image-index'));
    if (currentCardImageIndex === this.imageUrls.length - 1) {
      this.element.parentNode.classList.add('swiper-right-dead-end');
      setTimeout(() => {
        this.element.parentNode.classList.remove('swiper-right-dead-end');
      }, 333);
    } else {
      this.#setupCardImage(1 + currentCardImageIndex);
    }
  };

  #setupCardImage = (requestedCardImageIndex) => {
    console.log('requestedCardImageIndex', requestedCardImageIndex);
    const oldCardImageIndex = this.#cardImage.getAttribute('data-card-image-index');
    document.querySelector(`button[data-card-image-index="${oldCardImageIndex}"]`).classList.remove('card-image-active-indicator');
    this.#cardImage.src = this.imageUrls[requestedCardImageIndex];
    this.#cardImage.setAttribute('data-card-image-index', requestedCardImageIndex);
    document.querySelector(`button[data-card-image-index="${requestedCardImageIndex}"]`).classList.add('card-image-active-indicator');
  };

  #createCardImagePanes = () => {
    const cardImagePanes = document.createElement('div');
    cardImagePanes.classList.add('card-image-panes');
    cardImagePanes.append(this.#createCardImageLeftPane());
    cardImagePanes.append(this.#createCardImageRightPane());
    return cardImagePanes;
  };

  #createCardImageLeftPane = () => {
    const cardImageLeftPane = document.createElement('div');
    cardImageLeftPane.classList.add('card-image-left-pane');
    // cardImageLeftPane.addEventListener('click', (e) => {
    //   this.#switchToThePreviousCardImage();
    // }, true);
    return cardImageLeftPane;
  }

  #createCardImageRightPane = () => {
    const cardImageRightPane = document.createElement('div');
    cardImageRightPane.classList.add('card-image-right-pane');
    // cardImageRightPane.addEventListener('click', (e) => {
    //   this.#switchToTheNextCardImage();
    // }, true);
    return cardImageRightPane;
  }

  #createDislikeSpan = () => {
    const dislikeSpan = document.createElement('span');
    dislikeSpan.textContent = 'nope'
    dislikeSpan.classList.add('dislike-span');
    return dislikeSpan;
  }

  #createSuperlikeSpan = () => {
    const superlikeSpan = document.createElement('span');
    superlikeSpan.textContent = 'super like'
    superlikeSpan.classList.add('superlike-span');
    return superlikeSpan;
  }

  #createLikeSpan = () => {
    const likeSpan = document.createElement('span');
    likeSpan.textContent = 'like'
    likeSpan.classList.add('like-span');
    return likeSpan;
  }

  #listenToMouseEvents() {
    this.element.addEventListener('mousedown', (e) => {
      document.addEventListener('mouseup', this.#handleMoveUp);
      const { clientX, clientY, offsetX, offsetY } = e
      this.#swipeStartPoint = {
        clientX,
        clientY,
        top: this.#wasSwipeStartedFromTopSide(offsetY),
        left: this.#wasSwipeStartedFromLeftSide(offsetX)
      };
      document.addEventListener('mousemove', this.#handleMouseMove);
      this.element.style.transition = 'transform 0s';
    });

    // prevent card from being dragged
    this.element.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  }

  #wasSwipeStartedFromTopSide = (offsetY) => {
    return offsetY < this.element.clientHeight * 0.5;
  }

  #wasSwipeStartedFromLeftSide = (offsetX) => {
    return offsetX < this.element.clientWidth * 0.5;
  }

  #handleMove = (x, y) => {
    const offsetX = x - this.#swipeStartPoint.clientX;
    const offsetY = y - this.#swipeStartPoint.clientY;
    const rotate = Math.abs(offsetX * 0.1);

    const rotationConditions = [
      this.#swipeStartPoint.top && this.#swipeStartPoint.left && offsetX > 0,
      this.#swipeStartPoint.top && !this.#swipeStartPoint.left && offsetX > 0,
      !this.#swipeStartPoint.top && !this.#swipeStartPoint.left && offsetX < 0,
      !this.#swipeStartPoint.top && this.#swipeStartPoint.left && offsetX < 0
    ]
    const rotationDirection = rotationConditions.some(Boolean) ? 1 : -1;
    this.element.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotationDirection * rotate}deg)`;

    if (Math.abs(offsetY) > 2 * Math.abs(offsetX) && offsetY < -this.#SHIFT) {
      this.mode = this.#MODE.SUPERLIKE;
      this.#dislikeSpan.style.opacity = 0;
      this.#likeSpan.style.opacity = 0;
      this.#superlikeSpan.style.opacity = 1;
    } else if (offsetX < -this.#SHIFT) {
      this.mode = this.#MODE.DISLIKE;
      this.#likeSpan.style.opacity = 0;
      this.#superlikeSpan.style.opacity = 0;
      this.#dislikeSpan.style.opacity = 1;
    } else if (offsetX > this.#SHIFT) {
      this.mode = this.#MODE.LIKE;
      this.#superlikeSpan.style.opacity = 0;
      this.#dislikeSpan.style.opacity = 0;
      this.#likeSpan.style.opacity = 1;
    } else {
      this.mode = this.#MODE.THINKING;
      this.#superlikeSpan.style.opacity = 0;
      this.#dislikeSpan.style.opacity = 0;
      this.#likeSpan.style.opacity = 0;
    }
    // if (Math.abs(offsetX) - Card.SHIFT > this.element.clientWidth * 0.75) {
    //   if (offsetX > 0) {
    //     this.#dismiss(Card.DISMISS.RIGHT);
    //   } else {
    //     this.#dismiss(Card.DISMISS.LEFT);
    //   }
    // }
  }

  // mouse event handlers
  #handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    this.#handleMove(clientX, clientY);
  }

  #handleMoveUp = (e) => {
    switch (this.mode) {
      case this.#MODE.DISLIKE: {
        this.#dismiss();
        break;
      }
      case this.#MODE.SUPERLIKE: {
        this.#dismiss();
        break;
      }
      case this.#MODE.LIKE: {
        this.#dismiss();
        break;
      }
      default: {
        this.element.style.transition = 'transform 1s';
        this.element.style.transform = `translate(0px, 0px) rotate(0deg)`;
        this.#superlikeSpan.style.opacity = this.#dislikeSpan.style.opacity = this.#likeSpan.style.opacity = 0;
        break;
      }
    }
    document.removeEventListener('mousemove', this.#handleMouseMove);
  }

  #dismiss = () => {
    document.removeEventListener('mouseup', this.#handleMoveUp);
    document.removeEventListener('mousemove', this.#handleMouseMove);
    document.removeEventListener('click', this.#handleMouseMove);
    this.element.style.transition = 'transform 1s';
    this.element.classList.add('dismissing');
    setTimeout(() => {
      this.element.remove();
    }, 1000);
    this.onDismiss();
    switch (this.mode) {
      case this.#MODE.DISLIKE: {
        this.element.style.transform = `translate(-1500px, 0px) rotate(0deg)`;
        return this.onDislike();
      }
      case this.#MODE.SUPERLIKE: {
        this.element.style.transform = `translate(0px, -900px) rotate(0deg)`;
        return this.onSuperlike();
      }
      case this.#MODE.LIKE: {
        this.element.style.transform = `translate(1500px, 0px) rotate(0deg)`;
        return this.onLike();
      }
    }
  }
}