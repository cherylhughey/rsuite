import React from 'react';
import PropTypes from 'prop-types';
import Search from '@rsuite/icons/legacy/Search';

import { useClassNames, useEventCallback } from '../utils';
import { WithAsProps, RsRefForwardingComponent } from '../@types/common';

export interface SearchBarProps extends WithAsProps {
  value?: string;
  placeholder?: string;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: RsRefForwardingComponent<'div', SearchBarProps> = React.forwardRef(
  (props: SearchBarProps, ref) => {
    const {
      as: Component = 'div',
      classPrefix = 'picker-search-bar',
      value,
      children,
      className,
      placeholder,
      inputRef,
      onChange,
      ...rest
    } = props;
    const { withClassPrefix, merge, prefix } = useClassNames(classPrefix);
    const classes = merge(className, withClassPrefix());
    const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target?.value, event);
    });
    return (
      <Component {...rest} ref={ref} className={classes}>
        <input
          role="searchbox"
          className={prefix('input')}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          ref={inputRef}
        />
        <Search className={prefix('search-icon')} />
        {children}
      </Component>
    );
  }
);

SearchBar.displayName = 'SearchBar';
SearchBar.propTypes = {
  as: PropTypes.elementType,
  classPrefix: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func
};

export default SearchBar;
