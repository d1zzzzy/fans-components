## 属性 / Properties
| 属性名              | 类型          | 描述                         | 默认值                |
|------------------|-------------|----------------------------|--------------------|
| src              | String      | 主图片 url                    |                    |
| alt              | String      | 图片替代文本                     |                    |
| fallback         | String      | 备用图片 url                   |                    |
| loading          | String      | 加载文本                       | 图片加载中...(目前使用动画效果) |
| domains          | string[]    | 多个域名列表(会尝试根据域名列表+src来请求图片) |                    |
| threshold        | number      | 懒加载触发阈值                    | 0                  |
| rootMargin       | string      | 懒加载根边距                     | 0px                |
| intersectionRoot | HTMLElement | 懒加载根元素                     |                    |

## 插槽 / Slot

| 插槽名         | 描述     |
|-------------|--------|
| errorSlot   | 错误状态插槽 |
| loadingSlot | 加载状态插槽 |

