/**
 * This is a wrapper for the react-multi-carousel component listed here:
 * https://www.npmjs.com/package/react-multi-carousel
 */
import { ReactNode } from "react";
import { default as MultiCarousel } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const largeResponsive = {
  widescreen5: {
    breakpoint: { max: 3840, min: 2890 },
    items: 15,
  },
  widescreen4: {
    breakpoint: { max: 2890, min: 2650 },
    items: 14,
  },
  widescreen3: {
    breakpoint: { max: 2650, min: 2440 },
    items: 13,
  },
  widescreen2: {
    breakpoint: { max: 2440, min: 2200 },
    items: 12,
  },
  widescreen1: {
    breakpoint: { max: 2200, min: 2048 },
    items: 11,
  },
  widescreen: {
    breakpoint: { max: 2048, min: 1920 },
    items: 10,
  },
  desktop4: {
    breakpoint: { max: 1920, min: 1680 },
    items: 9,
  },
  desktop3: {
    breakpoint: { max: 1680, min: 1440 },
    items: 8,
  },
  desktop2: {
    breakpoint: { max: 1440, min: 1280 },
    items: 7,
  },
  desktop1: {
    breakpoint: { max: 1280, min: 1024 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 1024, min: 720 },
    items: 5,
  },
  common: {
    breakpoint: { max: 720, min: 480 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 480, min: 0 },
    items: 3,
  },
};

const smallResponsive = {
  widescreen5: {
    breakpoint: { max: 3840, min: 2890 },
    items: 15,
  },
  widescreen4: {
    breakpoint: { max: 2890, min: 2650 },
    items: 14,
  },
  widescreen3: {
    breakpoint: { max: 2650, min: 2440 },
    items: 13,
  },
  widescreen2: {
    breakpoint: { max: 2440, min: 2200 },
    items: 12,
  },
  widescreen1: {
    breakpoint: { max: 2200, min: 2048 },
    items: 11,
  },
  widescreen: {
    breakpoint: { max: 2048, min: 1920 },
    items: 10,
  },
  desktop4: {
    breakpoint: { max: 1920, min: 1680 },
    items: 9,
  },
  desktop3: {
    breakpoint: { max: 1680, min: 1440 },
    items: 4,
  },
  desktop2: {
    breakpoint: { max: 1440, min: 1280 },
    items: 4,
  },
  desktop1: {
    breakpoint: { max: 1280, min: 1024 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1024, min: 720 },
    items: 4,
  },
  common: {
    breakpoint: { max: 720, min: 480 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 480, min: 0 },
    items: 3,
  },
};

/**
 * @param {ReactNode} the contents of the carousel
 * @param {size} String for the size of the grid
 * @returns {ReactNode} items inside a carousel component
 *
 * example:
 * <Carousel size="large">
 *   {items.map((item: any) => {
 *     return (<div key={item.id}>{item.name}</div>);
 *   })}
 * </Carousel>
 */
const Carousel = ({size,  children }: { size: string,  children: React.ReactNode }): ReactNode => {
  if (size !== null && size === "large") {
    return <MultiCarousel responsive={largeResponsive}>{children}</MultiCarousel>;
  } else {
    return <MultiCarousel responsive={smallResponsive}>{children}</MultiCarousel>;
  }
  
};

export default Carousel;
