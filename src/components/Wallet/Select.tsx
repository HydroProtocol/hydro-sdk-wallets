import * as React from "react";
import PerfectScrollbar from "perfect-scrollbar";

export interface Option {
  value: any;
  text?: string;
  component?: any;
  onSelect?: any;
  hidden?: boolean;
  disabled?: boolean;
}

interface Props {
  options: Option[];
  selected: any;
  onSelect?: any;
  noCaret?: boolean;
  blank?: any;
  formatSelect?: any;
  disabled?: boolean;
}

interface State {
  unfolded: boolean;
}

export default class Select extends React.PureComponent<Props, State> {
  private id: string;
  private container: any;
  private ps: any;

  constructor(props: Props) {
    super(props);
    this.id = Math.random().toString();

    this.state = {
      unfolded: false
    };
  }

  private tryFoldListener = (e: Event) => {
    if (this.container && !this.container.contains(e.target)) {
      this.setState({ unfolded: false });
    }
  };

  public componentDidMount() {
    window.document.addEventListener("mouseup", this.tryFoldListener);
  }

  public componentWillUnmount() {
    window.document.removeEventListener("mouseup", this.tryFoldListener);
  }

  private switchFold = () => {
    this.setState({
      unfolded: !this.state.unfolded
    });
  };

  private setContainer = (ref: any) => {
    if (!ref) {
      return;
    }

    this.container = ref;
  };

  private getDropdownDirection(): string {
    if (!this.container) {
      return "down";
    }

    const topDistance = (elem: any) => {
      let location = 0;
      if (elem.offsetParent) {
        do {
          location += elem.offsetTop;
          elem = elem.offsetParent;
        } while (elem);
      }
      return location >= 0 ? location : 0;
    };

    const bottomDistance = window.innerHeight - topDistance(this.container) - this.container.offsetHeight;

    return bottomDistance < 200 ? "up" : "down";
  }

  private renderDropdown() {
    const { options, onSelect } = this.props;
    const items: JSX.Element[] = [];

    for (let option of options) {
      if (option.hidden) {
        continue;
      }

      items.push(
        <div
          key={option.value}
          className="HydroSDK-item"
          onClick={e => {
            if (option.disabled) {
              return;
            }

            if (onSelect) {
              onSelect(option, e);
            }
            if (option.onSelect) {
              option.onSelect(option, e);
            }
            this.setState({ unfolded: false });
          }}>
          {this.renderOption(option)}
        </div>
      );
    }

    const dropdownClassNames = ["HydroSDK-dropdown"];
    const direction = this.getDropdownDirection();

    if (direction === "down") {
      dropdownClassNames.push("down");
    } else if (direction === "up") {
      dropdownClassNames.push("up");
    }

    return (
      <div className={dropdownClassNames.join(" ")} ref={this.setRef}>
        {items}
      </div>
    );
  }

  private renderOption = (option: Option) => {
    return option.component ? option.component : option.text;
  };

  private renderSelected() {
    let selectOption;
    const { options, selected, formatSelect, noCaret, blank, disabled } = this.props;

    for (let option of options) {
      if (selected === option.value) {
        selectOption = option;
      }
    }

    return (
      <div
        className="HydroSDK-selected"
        onClick={() => {
          if (!disabled) {
            this.switchFold();
          }
        }}>
        {selectOption ? (formatSelect ? formatSelect(selectOption) : this.renderOption(selectOption)) : blank}
        {noCaret ? null : this.renderCaret()}
      </div>
    );
  }

  public setRef = (ref: any) => {
    if (ref) {
      this.ps = new PerfectScrollbar(ref, {
        suppressScrollX: true,
        maxScrollbarLength: 20
      });
    }
  };

  private renderCaret() {
    return <div className="HydroSDK-caret" />;
  }

  public render() {
    const { unfolded } = this.state;

    const classNames = ["HydroSDK-select"];

    if (unfolded) {
      classNames.push("HydroSDK-unfolded");
    }

    return (
      <div className={classNames.join(" ")} id={this.id} ref={this.setContainer}>
        {this.renderSelected()}
        {this.renderDropdown()}
      </div>
    );
  }
}
