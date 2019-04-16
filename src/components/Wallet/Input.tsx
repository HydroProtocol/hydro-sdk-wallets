import * as React from "react";
interface Props {
  handleChange: (passowr: string) => any;
  text: string;
  label: string;
}

class PasswordInput extends React.PureComponent<Props, {}> {
  public render() {
    const { handleChange, text, label } = this.props;
    return (
      <div className="HydroSDK-fieldGroup">
        <div className="HydroSDK-label">{label}</div>
        <input
          className="HydroSDK-input"
          type="password"
          value={text}
          onChange={e => handleChange(e.target.value)}
        />
      </div>
    );
  }
}

export default PasswordInput;
