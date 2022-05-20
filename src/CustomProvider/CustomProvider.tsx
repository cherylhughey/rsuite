import React, { useEffect } from 'react';
import { getClassNamePrefix, prefix } from '../utils/prefix';
import { Locale } from '../locales';
import { addClass, removeClass, canUseDOM } from '../DOMHelper';
import { MessageProps } from '../Message';
import { ButtonProps } from '../Button';

export interface CustomValue<T = Locale> {
  /** Language configuration */
  locale: T;

  /** Support right-to-left */
  rtl: boolean;

  /**
   * Return the formatted date string in the given format. The result may vary by locale.
   *
   * Example:
   *
   *  import format from 'date-fns/format';
   *  import eo from 'date-fns/locale/eo'
   *
   *  function formatDate(date, formatStr) {
   *    return format(date, formatStr, { locale: eo });
   *  }
   *
   * */
  formatDate: (date: Date | number, format: string) => string;

  /**
   * Return the date parsed from string using the given format string.
   *
   * Example:
   *
   *  import parse from 'date-fns/parse';
   *  import eo from 'date-fns/locale/eo'
   *
   *  function parseDate(date, formatStr) {
   *    return parse(date, formatStr, new Date(), { locale: eo });
   *  }
   *
   * */
  parseDate: (dateString: string, formatString: string) => Date;
}

type ComponentOverride<P> = {
  defaultProps?: Partial<P>;
};

export interface ComponentOverrides {
  Button?: ComponentOverride<ButtonProps>;
  Message?: ComponentOverride<MessageProps>;
}

export interface CustomProviderProps<T = Locale> extends Partial<CustomValue<T>> {
  /** Supported themes */
  theme?: 'light' | 'dark' | 'high-contrast';

  /** The prefix of the component CSS class */
  classPrefix?: string;

  /**
   * Override component defaults
   *
   * NOTICE: This prop is still under development, and should not be considered production-ready
   *         until it's mentioned in the official documentation.
   *         It's available now as a preview only for extremly narrow use cases.
   */
  PREVIEW_components?: ComponentOverrides;

  /** Primary content */
  children?: React.ReactNode;
}

const CustomContext = React.createContext<CustomProviderProps>({});
const { Consumer, Provider } = CustomContext;
const themes = ['light', 'dark', 'high-contrast'];

const CustomProvider = (props: CustomProviderProps) => {
  const { children, classPrefix = getClassNamePrefix(), theme, ...rest } = props;

  const value = React.useMemo(() => ({ classPrefix, theme, ...rest }), [classPrefix, theme, rest]);

  useEffect(() => {
    if (canUseDOM && theme) {
      addClass(document.body, prefix(classPrefix, `theme-${theme}`));

      // Remove the className that will cause style conflicts
      themes.forEach(t => {
        if (t !== theme) {
          removeClass(document.body, prefix(classPrefix, `theme-${t}`));
        }
      });
    }
  }, [classPrefix, theme]);

  return <Provider value={value}>{children}</Provider>;
};

export { CustomContext, Consumer as CustomConsumer };

export default CustomProvider;
