import React, { FunctionComponent, useState } from 'react';
import { CarouselControl, Carousel, CarouselItem, CarouselIndicators } from 'reactstrap';
import { IAdvertiseResultModel } from '@src/models/output/advertise/IAdvertiseResultModel';

export interface ISlider {
  slideList: IAdvertiseResultModel[];
}

const Slider: FunctionComponent<ISlider> = ({ slideList }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const itemLength = slideList.length - 1;

  const previousButton = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? itemLength : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const nextButton = () => {
    if (animating) return;
    const nextIndex = activeIndex === itemLength ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const carouselItemData = slideList.map((item) => {
    return (
      <CarouselItem 
      className="slider-item-box" style={{backgroundImage:`url(${item.imageUrl})`}}
      key={item.id} onExited={() => setAnimating(false)} onExiting={() => setAnimating(true)}>
        {/* <img src={item.imageUrl} alt={item.summary} /> */}
        <div className="slider-item-image" style={{backgroundImage:`url(${item.imageUrl})`}}></div>
        {/* <picture>
          <source media="(min-width:650px)" srcSet={item.imageUrl}/>
          <source media="(min-width:465px)" srcSet={item.imageUrl}/>
          <img src={item.imageUrl} alt={item.summary} style={{width: 'auto'}}/>
        </picture> */}
      </CarouselItem>
    );
  });

  return (
    <>
      <Carousel previous={previousButton} next={nextButton} activeIndex={activeIndex}>
        <CarouselIndicators
          items={slideList}
          activeIndex={activeIndex}
          onClickHandler={(newIndex) => {
            if (animating) return;
            setActiveIndex(newIndex);
          }}
        />
        {carouselItemData}
        <CarouselControl directionText="Prev" direction="prev" onClickHandler={previousButton} />
        <CarouselControl directionText="Next" direction="next" onClickHandler={nextButton} />
      </Carousel>
    </>
  );
};

export default Slider;
