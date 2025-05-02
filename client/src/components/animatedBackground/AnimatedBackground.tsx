import React, { useState, useEffect } from 'react';
import Debouncer from '@schnej7/debouncer';

import './AnimatedBackground.scss';

export default function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const elAPP = document.getElementById('APP');

    const handleScrollDebouncer = new Debouncer((event: Event) => {
      if (elAPP) {
        console.log(event);
        setScrollY(elAPP.scrollTop);
        setPageHeight(elAPP.scrollHeight);
      }
    }, 100);
    const handleScroll = (event: Event) => handleScrollDebouncer.debounce(event);

    if (elAPP) {
      elAPP.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (elAPP) {
        elAPP.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return Array.from({length: 4}, (_, i) => i + 1)
    .map((idx: number) => 
      <BackgroundPanel idx={idx} scrollY={scrollY} pageHeight={pageHeight} />
    );
}

type BackgroundPanelProps = {
  idx: number;
  scrollY: number;
  pageHeight: number;
};

function BackgroundPanel(props: BackgroundPanelProps) {
  const deg = (props.idx % 2 ? -1 : 1) * 1 * (props.idx + 1);
  const gradPercent = 100 - 20 * (props.idx);
  const topPercent = ((props.scrollY / props.pageHeight) * 100 * props.idx) - 100;

  const style: React.HTMLAttributes<HTMLDivElement> = {
    'background-image': `linear-gradient(${deg}deg, #59E ${gradPercent}%, #FFF ${gradPercent}%)`,
    top: `${topPercent}%`,
  } as React.HTMLAttributes<HTMLDivElement>;

  return (
    <>
      <div
        className={`bg-`}
        style={style}
      />
    </>
  )
}

