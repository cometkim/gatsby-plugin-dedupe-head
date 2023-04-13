import { type GatsbySSR } from 'gatsby';
import * as React from 'react';
import type {} from 'react-dom';

import { type PluginOptions } from './types';

export const onPreRenderHTML: GatsbySSR['onPreRenderHTML'] = ({
  getHeadComponents,
  replaceHeadComponents,
}, options) => {
  const {
    strategy = 'pick_last',
  } = options as unknown as PluginOptions;

  const elements = getHeadComponents();

  const metaNamesToDedupe = [
    'description',
    'twitter:card',
    'twitter:site',
    'twitter:creator',
    'twitter:title',
    'twitter:description',
    // Unlike OpenGraph, Twitter Cards allows a single image
    'twitter:image',
    'twitter:image:alt',
    'twitter:app:id:googleplay',
    'twitter:app:url:googleplay',
    'twitter:app:id:iphone',
    'twitter:app:url:iphone',
    'twitter:app:id:ipad',
    'twitter:app:url:ipad',
    'twitter:app:country',
    'twitter:player',
    'twitter:player:width',
    'twitter:player:height',
  ];
  const metaPropertiesToDedupe = [
    'og:type',
    'og:url',
    'og:site_name',
    'og:title',
    'og:description',
    'og:determiner',
    'og:locale',
    'fb:app_id',
  ];

  const collector = new Map<string, React.ReactElement>();
  function shouldCollect(key: string) {
    return strategy === 'pick_last' || !collector.has(key);
  }
  function tryCollect(key: string, element: React.ReactElement) {
    if (shouldCollect(key)) {
      collector.set(key, element);
    }
  }

  // mark
  let elementCounter = 0;

  for (const element of elements) {
    if (!React.isValidElement(element)) {
      continue;
    }

    if (isTitleElement(element)) {
      tryCollect('title', element);
      continue;
    }

    if (isLinkElement(element) && element.props.rel === 'canonical') {
      tryCollect('link:canonical', element);
      continue;
    }

    if (isMetaElement(element)) {
      if (metaNamesToDedupe.includes(element.props.name || '')) {
        tryCollect(`meta:name:${element.props.name}`, element);
        continue;
      }

      if (metaPropertiesToDedupe.includes(element.props.property || '')) {
        tryCollect(`meta:property:${element.props.property}`, element);
        continue;
      }
    }

    tryCollect((elementCounter++).toString(), element);
  }

  // don't sweep
  const shouldLeave = [...collector.values()];
  const copy = [] as React.ReactNode[];

  for (const element of elements) {
    if (React.isValidElement(element)) {
      if (shouldLeave.includes(element)) {
        copy.push(element);
      }
    } else {
      copy.push(element);
    }
  }

  replaceHeadComponents(copy);
};

function isTitleElement(element: React.ReactElement): element is React.ReactElement<JSX.IntrinsicElements['title']> {
  return element.type === 'title';
}

function isMetaElement(element: React.ReactElement): element is React.ReactElement<JSX.IntrinsicElements['meta']> {
  return element.type === 'meta';
}

function isLinkElement(element: React.ReactElement): element is React.ReactElement<JSX.IntrinsicElements['link']> {
  return element.type === 'link';
}
