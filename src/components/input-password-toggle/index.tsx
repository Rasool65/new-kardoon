// ** React Imports
import { Fragment, useState, forwardRef, FunctionComponent } from 'react';

// ** Third Party Components
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Eye, EyeOff } from 'react-feather';

// ** Reactstrap Imports
import { InputGroup, Input, InputGroupText, Label } from 'reactstrap';
import { IInputPasswordToggleProp } from './IInputPasswordToggleProp';

const defaultProps: IInputPasswordToggleProp = {
  visible: false,
  invalid: false,
  hideIcon: undefined,
  showIcon: undefined,
  className: '',
  placeholder: '',
  iconSize: 0,
  inputClassName: '',
  label: undefined,
  htmlFor: undefined,
};

const InputPasswordToggle: FunctionComponent<IInputPasswordToggleProp> = (props = defaultProps) => {
  // ** Props
  const { label, hideIcon, showIcon, visible, className, htmlFor, placeholder, iconSize, inputClassName, invalid, ...rest } =
    props;

  // ** State
  const [inputVisibility, setInputVisibility] = useState(visible);

  // ** Renders Icon Based On Visibility
  const renderIcon = () => {
    const size = iconSize ? iconSize : 14;

    if (inputVisibility === false) {
      return hideIcon ? hideIcon : <Eye size={size} />;
    } else {
      return showIcon ? showIcon : <EyeOff size={size} />;
    }
  };

  return (
    <Fragment>
      {label ? (
        <Label className="form-label" for={htmlFor}>
          {label}
        </Label>
      ) : null}
      <InputGroup
        className={classnames({
          [className]: className,
          'is-invalid': invalid,
        })}
      >
        <Input
          invalid={invalid}
          type={inputVisibility === false ? 'password' : 'text'}
          placeholder={placeholder ? placeholder : '············'}
          autoComplete="off"
          className={classnames({
            [inputClassName]: inputClassName,
          })}
          /*eslint-disable */
          {...(label && htmlFor
            ? {
                id: htmlFor,
              }
            : {})}
          {...rest}
          /*eslint-enable */
        />
        <InputGroupText className="cursor-pointer" onClick={() => setInputVisibility(!inputVisibility)}>
          {renderIcon()}
        </InputGroupText>
      </InputGroup>
    </Fragment>
  );
};

export default InputPasswordToggle;
