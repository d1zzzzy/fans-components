import { html, TemplateResult } from 'lit';
import '../../dist/src/components/LazyImg/index.js';

export default {
  title: 'LazyImg',
  component: 'lazy-img',
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    fallback: { control: 'text' },
    loading: { control: 'text' },
    domains: { control: 'array' },
    threshold: { control: 'number' },
    intersectionRoot: { control: 'object' },
    rootMargin: { control: 'text' },

    errorSlot: { control: 'object' },
    loadingSlot: { control: 'object' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  src: string;
  alt: string;
  fallback?: string;
  loading: string;
  domains: string[];
  threshold?: number;
  intersectionRoot: HTMLElement | null;
  rootMargin?: string;
  errorSlot: TemplateResult | null;
  loadingSlot: TemplateResult | null;
}

const Template: Story<ArgTypes> = ({
  src,
  alt,
  fallback,
  loading,
  domains,
  threshold,
  intersectionRoot,
  rootMargin,
  errorSlot,
  loadingSlot,
}: ArgTypes) => html`
  <lazy-img
    src="${src}"
    alt="${alt}"
    fallback="${fallback}"
    loading="${loading}"
    .domains="${domains}"
    threshold="${threshold}"
    intersectionRoot="${intersectionRoot}"
    rootMargin="${rootMargin}"
    .errorSlot="${errorSlot}"
    .loadingSlot="${loadingSlot}"
  >
  </lazy-img>
`;

export const Default = Template.bind({});
Default.args = {
  src: '/assets/three-attributes.png',
  domains: ['https://demo.fansheng.today'],
  alt: 'A beautiful image',
  loading: 'Loading...',
};

export const LoadFailure = Template.bind({});
LoadFailure.args = {
  src: 'https://nonexistent.domain.com/image.png',
  alt: 'A beautiful image',
  fallback: 'https://demo.fansheng.today/assets/fallback.png',
  loading: 'Loading...',
};

export const CustomLoadingSlot = Template.bind({});
CustomLoadingSlot.args = {
  src: '/assets/three-attributes.png',
  domains: ['https://backup.demo.fansheng.today', 'https://demo.fansheng.today'],
  alt: 'A beautiful image',
  loading: '',
  loadingSlot: html`<div class="custom-loading">自定义加载中...</div>`,
};

export const CustomErrorSlot = Template.bind({});
CustomErrorSlot.args = {
  src: 'https://nonexistent.domain.com/image.png',
  alt: 'A beautiful image',
  fallback: 'https://demo.fansheng.today/assets/fallback.png',
  loading: 'Loading...',
  errorSlot: html`<div class="custom-error">图片加载失败，请重试。</div>`,
};

export const DifferentThresholds = Template.bind({});
DifferentThresholds.args = {
  src: '/assets/three-attributes.png',
  domains: ['https://demo.fansheng.today'],
  alt: 'A beautiful image',
  loading: 'Loading...',
  threshold: 0.1,
};

export const DifferentRootMargins = Template.bind({});
DifferentRootMargins.args = {
  src: '/assets/three-attributes.png',
  domains: ['https://demo.fansheng.today'],
  alt: 'A beautiful image',
  loading: 'Loading...',
  rootMargin: '200px',
};
