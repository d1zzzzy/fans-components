import { TemplateResult, LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

import { LazyImgConfig, LazyImgGlobalConfig, LoadingType } from '../LazyImgConfig/LazyImgConfig.js';

export class LazyImg extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      min-width: 100px;
      min-height: 100px;
      font-size: 12px;
    }
    img {
      width: 100%;
      height: auto;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    img.loaded {
      opacity: 1;
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      color: #4C5270;
      min-width: 100%;
      min-height: 100%;
    }
    .error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      color: #F51720;
      min-width: 100%;
      min-height: 100%;
      text-align: center;
    }

    .loading-spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-top-color: #4C5270;
      animation: spin 1s linear infinite;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `;

  @property({ type: String }) src: string = ''; // 主图片 url

  @property({ type: String }) alt: string = ''; // 图片替代文本

  @property({ type: String }) fallback: string = ''; // 备用图片 url

  @property({ type: String }) loading = '图片加载中...'; // 加载文本

  @property({ type: Array }) domains: string[] = []; // 多个域名列表

  @property({ type: Number }) threshold = 0; // 懒加载触发阈值

  @property({ type: Object }) intersectionRoot: HTMLElement | null = null; // 懒加载根元素

  @property({ type: String }) rootMargin = '0px'; // 懒加载根边距

  @property({ type: Object }) errorSlot: TemplateResult | null = null; // 错误状态插槽

  @property({ type: Object }) loadingSlot: TemplateResult | null = null; // 加载状态插槽

  @property({ type: String }) loadingType: LoadingType = "spinner";

  private _observer: IntersectionObserver | null = null;

  private _currentDomainIndex = 0; // 当前尝试的域名索引

  @state() _isLoaded = false; // 图片是否加载成功

  @state() private _isError = false; // 图片是否加载失败

  connectedCallback() {
    super.connectedCallback();
    this._initLazyLoad();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  // 初始化懒加载
  private _initLazyLoad() {
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this._isLoaded) {
            this._loadImage();
            this._observer?.disconnect();
          }
        });
      },
      {
        root: this.intersectionRoot,
        rootMargin: this.rootMargin,
        threshold: this.threshold
      }
    );
    this._observer.observe(this);
  }

  // 加载图片
  private async _loadImage() {
    const img = this.shadowRoot?.querySelector('img');
    const config = this._effectiveConfig;

    console.log(config);

    if (!img) return;

    while (config.domains && (this._currentDomainIndex < config.domains.length)) {
      const domain = config.domains[this._currentDomainIndex];

      try {
        const src = new URL(`${domain}${this.src}`).href; // 使用 new URL 确保 src 是绝对路径

        // 移除之前的事件处理程序
        img.onload = null;
        img.onerror = null;

        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            this._isLoaded = true;
            img.classList.add('loaded');
            resolve();
          };
          img.onerror = () => {
            reject(new Error(`Failed to load image from ${domain}`));
          };
          img.src = src;
        });
        // 图片加载成功，立即跳出循环和方法
        return;
      } catch (error) {
        // 加载失败，尝试下一个域名
        this._currentDomainIndex += 1;
      }
    }

    img.onerror = () => {
      this._isError = true;
      img.classList.add('loaded');
    };

    img.onload = () => {
      this._isLoaded = true;
      img.classList.add('loaded');
    };

    // 所有域名加载失败，设置错误状态并尝试加载备用图片
    if (config.fallback) {
      img.src = this.fallback;
    } else {
      img.src = this.src;
    }
  }

  render() {
    return html`
      <div class="image-container">
        ${this._renderImageStatus()}
        ${
          this._isError
            ? null
            : (
              html`
                <img
                  src=''
                  alt=${this.alt || '图片'}
                  @load=${this._handleLoad}
                  @error=${this._handleError}
                />
              `
            )
        }
      </div>
    `;
  }

  // 新增方法，用于渲染图片状态
  private _renderImageStatus(): TemplateResult | null {
    if (this._isError) {
      return this.errorSlot
        ? this.errorSlot
        : html`<div class="error">${ this.alt }</div>`;
    }
    if (!this._isLoaded) {
      return this.loadingSlot
        ? this.loadingSlot
        : html`<div class="loading-spinner"></div>`;
    }

    return null;
  }

  // 合并全局配置和组件属性
  private get _effectiveConfig(): LazyImgGlobalConfig {
    const { domains, fallback } = LazyImgConfig.globalConfig;
    console.log('LazyImgConfig.globalConfig', LazyImgConfig.globalConfig);

    return {
      ...LazyImgConfig.globalConfig,

      domains: this.domains.length ? this.domains : domains,
      fallback: this.fallback || fallback,
    }
  }

  // 触发事件
  private _handleLoad() {
    this.dispatchEvent(new CustomEvent('load', { detail: { src: this.src } }));
  }

  private _handleError() {
    this.dispatchEvent(new CustomEvent('error', { detail: { src: this.src } }));
  }
}
