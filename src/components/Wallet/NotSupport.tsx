import * as React from "react";
import Svg from "../Svg";

interface Props {
  iconName: string;
  title: string;
  desc: string;
}

interface State {}

class NotSupport extends React.PureComponent<Props, State> {
  public render() {
    const { iconName, title, desc } = this.props;
    return (
      <div className="HydroSDK-notSupport">
        <Svg name={iconName} size="80" />
        <div className="HydroSDK-notSupportTitle">{title}</div>
        <div className="HydroSDK-notSupportDesc" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
    );
  }
}

export default NotSupport;
