import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export type LoadingType = "spinner" | "text" | "custom";

// 全局配置类型
export interface LazyImgGlobalConfig {
  domains: string[];
  fallback: string;
  threshold: number;
  rootMargin: string;
}

export class LazyImgConfig extends LitElement {
  static globalConfig: LazyImgGlobalConfig = {
    domains: [],
    fallback: "",
    threshold: 0,
    rootMargin: "0px"
  }

  @property({ type: Array }) domains: string[] = [];

  @property({ type: String }) fallback: string = '';

  @property({ type: Number }) threshold: number = 0;

  @property({ type: String }) rootMargin: string = "0px";


  // 更新全局配置
  updated() {
    LazyImgConfig.globalConfig = {
      ...LazyImgConfig.globalConfig,
      fallback: this.fallback,
      domains: this.domains,
      threshold: this.threshold,
      rootMargin: this.rootMargin,
    };
  }

  render() {
    return html``;
  }
}
