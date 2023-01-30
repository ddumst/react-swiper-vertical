import React, { FC, useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

import { Swiper as SwiperOriginal, Autoplay, Navigation } from "swiper";
import { AGENTS } from '../../dummy-data';

const { Content } = Layout;

interface ProgressSlide extends HTMLElement {
  progress: number;
}

const Landing: FC = () => {
  const [ swiperEl, setSwiperEl ] = useState<HTMLElement>();
  const [ swiperWrapper, setSwiperWrapper ] = useState<HTMLElement>();

  const pointerDownSlideListener = (event: Event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
  };

  useEffect(() => {
    setSwiperEl(document.getElementById("carousel-vertical-swiper") || undefined);
    setSwiperWrapper(swiperEl?.querySelector(".swiper-wrapper") as HTMLElement || undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <Content className="container text-center py-4 px-0">
        <h1 className="text-3xl mb-2 mt-8">React + Swiper Vertical (Blured)</h1>

        <h5 className='mb-8'>by <a href="https://twitter.com/ddumst" target={"_blank"}>@dDumst</a></h5>

        <div className='overflow-hidden h-[70%] md:h-[80%] flex justify-center'>
          <Swiper
            id="carousel-vertical-swiper"
            className='h-full'
            watchSlidesProgress={true}
            loop={true}
            autoplay={{
              delay: 3000
            }}
            direction='vertical'
            loopedSlides={1}
            spaceBetween={10}
            slidesPerView={'auto'}
            centeredSlides={true}
            modules={[Autoplay, Navigation]}
            navigation={{
              nextEl: ".swiper-partner-next",
              prevEl: ".swiper-partner-prev",
            }}
            onBeforeTransitionStart={() => {
              const slideAnchors = swiperWrapper?.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>;
              for (let i = 0; i < slideAnchors?.length; i++) {
                const slideAnchor = slideAnchors[i];
                slideAnchor.removeEventListener(
                  "pointerdown",
                  pointerDownSlideListener,
                  true
                );
                slideAnchor.addEventListener(
                  "pointerdown",
                  pointerDownSlideListener,
                  true
                );
              }
            }}
            onSetTransition={(swiper: SwiperOriginal, duration: number) => {
              for (let i = 0; i < swiper.slides.length; i += 1) {
                const slideEl = swiper.slides[i] as HTMLElement;
                const opacityEls = slideEl.querySelectorAll(
                  ".carousel-slider-animate-opacity"
                ) as NodeListOf<HTMLElement>;
                slideEl.style.transitionDuration = `${duration}ms`;
                opacityEls.forEach((opacityEl) => {
                  opacityEl.style.transitionDuration = `${duration}ms`;
                });
              }
            }}
            onProgress={(swiper: SwiperOriginal) => {
              const scaleStep = 0.11;
              const getSlideScale = (progress: number) => {
                return 1 - Math.abs(progress) * scaleStep;
              }

              const getTranslateOffsetStep = (progress: number): number => {
                if (progress < 1) {
                  return 0;
                }
                return 1 - getSlideScale(progress) + getTranslateOffsetStep(progress - 1);
              }

              const getTranslateOffset = (progress: number): number => {
                // Can get non-integer values on first render
                if (progress < 1) {
                  return 0;
                }
                return (
                  (1 - getSlideScale(progress)) * 4.75 + getTranslateOffsetStep(progress - 1)
                );
              }

              const zIndexMax = swiper.slides.length;
              for (let i = 0; i < swiper.slides.length; i += 1) {
                const slideEl = swiper.slides[i] as ProgressSlide;
                const slideProgress = slideEl.progress as number;
                const absProgress = Math.abs(slideProgress);
                const progressSign = absProgress === 0 ? 0 : slideProgress / absProgress;
                const opacityEls = slideEl.querySelectorAll(
                  '.carousel-slider-animate-opacity',
                ) as NodeListOf<HTMLElement>;
                const translate = `${progressSign * getTranslateOffset(absProgress) * 100}%`;  
                const scale = getSlideScale(slideProgress) as number;
                const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
                slideEl.style.transform = `translateY(${translate}) scale(${scale})`;
                slideEl.style.zIndex = String(zIndex);
                if (absProgress > 3) {
                  slideEl.style.opacity = String(0);
                } else {
                  slideEl.style.opacity = String(1);
                }

                opacityEls.forEach((opacityEl) => {
                  opacityEl.style.opacity = (1 - absProgress / 3).toString();
                });
              }
            }}
          >
            {AGENTS.map((agent) => {
              return (
                <SwiperSlide
                  key={agent.displayName}
                  className="border-[1px] rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center relative h-full bg-center bg-no-repeat bg-cover gap-4" 
                    style={{ backgroundImage: 'url("https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltbded518020183769/5eb26f5389bac8148a8006cc/agent-background-generic.JPG")'}}
                  >
                    <img
                      className="z-10 h-full"
                      src={agent.bustPortrait}
                      alt={agent.displayName}
                    />
                    <div className="flex flex-col justify-between items-center p-10 z-10 absolute right-0">
                      <div>
                        <div className="text-white font-extrabold uppercase text-4xl">{agent.displayName}</div>
                        <div className="text-white font-extrabold uppercase text-md">
                          // ROLE: {agent.role.displayName}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a 
                          href={`https://playvalorant.com/en-us/agents/${agent.displayName}/`}
                          className="text-white font-extrabold uppercase text-lg rounded-3xl bg-[#e94b5a] px-4 py-2"
                          target={"_blank"}
                        >
                          view agent
                        </a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </Content>
    </>
  )
};

export default Landing;
