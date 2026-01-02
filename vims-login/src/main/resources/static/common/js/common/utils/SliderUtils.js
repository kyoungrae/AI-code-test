/**
 * @title : SliderUtils
 * @text : CommonTag Slider Utility Classes
 */

class GiSlider {
    id;
    slider;
    sliderWrapper;
    itemsLength;
    currentIndex = 0;

    isAutoRotated;
    rotateIntervalSec;

    constructor(id) {
        this.id = id;
        this.slider = $(`#${id}[gi-slider]`);
        this.sliderWrapper = this.slider.find('[gi-slider-wrapper]');
        this.itemsLength = this.sliderWrapper.find('[gi-slider-item]').length;

        this.isAutoRotated = this.slider.data('auto-rotated') === '1';
        this.rotateIntervalSec = Number(this.slider.data('rotate-interval-sec'));

        this.make();
        this.setInterval();
    }

    make() {
        this.slider.find('[gi-slider-prev], [gi-slider-next], [gi-slider-item-clone]').remove();
        this.slider.append(`
        <div class="slider-left" gi-slider-prev></div>
        <div class="slider-right" gi-slider-next></div>
    `);

        const firstClone = this.sliderWrapper.find('[gi-slider-item]').first().clone();
        const lastClone = this.sliderWrapper.find('[gi-slider-item]').last().clone();

        this.sliderWrapper.prepend(lastClone);
        this.sliderWrapper.append(firstClone);

        this.sliderWrapper.children(':first-child, :last-child').attr('gi-slider-item-clone', '');

        this.itemsLength = this.sliderWrapper.find('[gi-slider-item]').length;
        this.currentIndex = 1;

        this.sliderWrapper.css('transform', `translateX(-100%)`);

        this.slider.off('click.clickSliders').on('click.clickSliders', '[gi-slider-prev], [gi-slider-next]', (event) => {
            const isPrev = $(event.target).is('[gi-slider-prev]');
            const isNext = $(event.target).is('[gi-slider-next]');

            const div = $(event.target);
            div.prop('disabled', true);

            setTimeout(() => {
                div.prop('disabled', false);
            }, 500);

            if (isPrev) {
                this.currentIndex--;
            } else if (isNext) {
                this.currentIndex++;
            }

            clearInterval(window.giSliderIntervals[this.id]);

            this.move();

            this.setInterval();
        });
    }

    move() {
        this.sliderWrapper.css('transition', 'transform 0.5s ease-in-out');
        const offset = -this.currentIndex * 100;
        this.sliderWrapper.css('transform', `translateX(${offset}%)`);

        setTimeout(() => {
            if (this.currentIndex === 0) {
                this.sliderWrapper.css('transition', 'none');
                this.currentIndex = this.itemsLength - 2;
                this.sliderWrapper.css('transform', `translateX(-${this.currentIndex * 100}%)`);
            }

            if (this.currentIndex === this.itemsLength - 1) {
                this.sliderWrapper.css('transition', 'none');
                this.currentIndex = 1;
                this.sliderWrapper.css('transform', `translateX(-100%)`);
            }
        }, 500);
    }

    setInterval() {
        if (window.giSliderIntervals?.[this.id]) {
            clearInterval(window.giSliderIntervals[this.id]);
        }

        if (!this.isAutoRotated || !this.rotateIntervalSec) return;

        if (!window.giSliderIntervals) {
            window.giSliderIntervals = {};
        }

        window.giSliderIntervals[this.id] = setInterval(() => {
            if (!$(`#${this.id}[gi-slider]`).length) {
                clearInterval(window.giSliderIntervals[this.id]);
                delete window.giSliderIntervals[this.id];
                return;
            }

            this.currentIndex = (this.currentIndex + 1) % this.itemsLength;
            this.move();
        }, this.rotateIntervalSec * 1000);
    }

    reload() {
        this.itemsLength = this.sliderWrapper.find('[gi-slider-item]').length;
        this.make();
    }

    //한번 클릭 시 stopInterval
}
