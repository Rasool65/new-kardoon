import { FunctionComponent } from 'react';
import { IToggleProp } from './IToggleProp';

const Toggle: FunctionComponent<IToggleProp> = (Props) => {
  const { checked, disabled, onChange, offstyle, onstyle } = Props;
  const displayStyle = checked ? onstyle : offstyle;
  return (
    <>
      <label>
        <span className="switch-wrapper">
          <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e)} />
          <span className={`${displayStyle} switch`}>
            <span className="switch-handle" />
          </span>
        </span>
      </label>
    </>
  );
};

export default Toggle;
