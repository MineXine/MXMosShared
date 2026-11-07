/**
 * MDC（Markdown Components）配置表与解析器 —— 前后端共用。
 *
 * 前端用于编辑器实时预览，后端用于解析入库的组件选项，
 * 保证两端对同一段 Markdown 得到完全一致的组件参数。
 */

/** 允许使用的 MDC 自定义组件白名单 */
export const ALLOWED_MDC = [
  'alert',
  'callout',
  'badge',
  'card',
  'quote-card',
  'todo',
  'collapse',
  'divider',
  'media',
  'timeline-item',
  'poll',
] as const;

export type MdcComponentName = (typeof ALLOWED_MDC)[number];

/**
 * 组件默认选项表。
 *
 * 正文里显式声明的 props 优先；未声明的项使用这里的默认值补齐。
 * 需要新增组件时：在此登记默认值 → 前端 markdown.ts 增加渲染分支 → 编辑器登记可插入项。
 */
export const MDC_DEFAULTS: Record<string, Record<string, string | number | boolean>> = {
  alert: { type: 'info', title: '提示', closable: true },
  callout: { type: 'info', icon: '💡', title: '' },
  badge: { type: 'default', text: '徽章' },
  card: { title: '', subtitle: '', variant: 'default' },
  'quote-card': { author: '', source: '' },
  todo: { checked: false, text: '待办' },
  collapse: { title: '展开', open: false },
  divider: { color: 'gray', text: '' },
  media: { layout: 'default', caption: '' },
  'timeline-item': { time: '', type: 'default', title: '' },
  poll: { question: '', options: '', multiple: false },
};

/** 解析 `{key="value" key2=123 flag}` 形式的属性串 */
export function parseMdcAttrs(raw?: string): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!raw) return out;

  const re = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s,}]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const key = m[1];
    const val = m[2] ?? m[3] ?? m[4] ?? '';
    if (val === 'true') out[key] = true;
    else if (val === 'false') out[key] = false;
    else if (/^-?\d+(\.\d+)?$/.test(val)) out[key] = Number(val);
    else out[key] = val;
  }

  // 无值属性视为 true
  for (const part of raw.slice(1, -1).split(/[\s,]+/)) {
    const t = part.trim();
    if (t && !t.includes('=') && out[t] === undefined) out[t] = true;
  }

  return out;
}

export interface MdcOption {
  name: string;
  props: Record<string, string | number | boolean>;
}

/**
 * 解析 Markdown 中的 MDC 组件声明。
 *
 * 语法：
 *   块级  `::alert{type="warning" title="注意"}\n内容\n::`
 *   行内  `::badge{text="新"}`
 *
 * 合并规则：正文显式声明的 props > MDC_DEFAULTS 中的默认值
 */
export function parseMdcOptions(
  markdown: string,
  defaults: Record<string, Record<string, string | number | boolean>> = MDC_DEFAULTS,
): MdcOption[] {
  const found = new Map<string, Record<string, string | number | boolean>>();

  const blockRe = /^::([a-zA-Z][\w-]*)\s*(\{[^}]*\})?\s*$/gm;
  const inlineRe = /::([a-zA-Z][\w-]*)\s*(\{[^}]*\})?/g;

  const collect = (re: RegExp) => {
    let m: RegExpExecArray | null;
    while ((m = re.exec(markdown)) !== null) {
      const name = m[1];
      if (!ALLOWED_MDC.includes(name as MdcComponentName)) continue;
      const props = parseMdcAttrs(m[2]);
      const merged = { ...(defaults[name] ?? {}), ...props };
      found.set(name, found.has(name) ? { ...found.get(name), ...merged } : merged);
    }
  };

  collect(blockRe);
  collect(inlineRe);

  return [...found.entries()].map(([name, props]) => ({ name, props }));
}
