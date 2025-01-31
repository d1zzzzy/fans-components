import { html, TemplateResult } from 'lit';
import '../../dist/src/components/LazyImgConfig/index.js';
import '../../dist/src/components/LazyImg/index.js';

export default {
  title: 'LazyImgConfig',
  component: 'lazy-img-config',
  argTypes: {
    fallback: { control: 'text' },
    domains: { control: 'array' },
    threshold: { control: 'number' },
    rootMargin: { control: 'text' },
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
  domains,
  threshold,
  rootMargin,
}: ArgTypes) => html`
  <section>
    <lazy-img-config
      .domains="${domains}"
      threshold="${threshold}"
      rootMargin="${rootMargin}"
    ></lazy-img-config>

    <lazy-img
      src="/assets/three-attributes.png"
      alt="A beautiful image"
      loading="Loading..."
    >
    </lazy-img>
  </section>
`;

export const Default = Template.bind({});

Default.args = {
  src: '/assets/three-attributes.png',
  domains: ['https://demo.fansheng.today'],
  alt: 'A beautiful image',
  loading: 'Loading...',
};
