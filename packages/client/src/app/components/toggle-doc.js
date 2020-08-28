import React from "react";
import { Icon, styled } from "@patternplate/components";

import ToggleButton from "./common/toggle-button";

export default ToggleDoc;

function ToggleDoc(props) {
  return (
    <StyledToggleButton
      active={props.active}
      enabled={props.enabled}
      shortcut={props.shortcut}
      title={title(props)}
    >
      <StyledIcon active={props.active} enabled={props.enabled} symbol="doc" />
      {props.shortcut.toString()}
    </StyledToggleButton>
  );
}

function title(props) {
  return props.active ? null : "No documentation available.";
}

const CURSOR = props => (props.active ? "pointer" : "not-allowed");

const COLOR = props => {
  if (props.active) {
    return props.enabled ? props.theme.colors.active : props.theme.colors.color;
  }
  return props.theme.colors.border;
};

const StyledIcon = styled(Icon)`
  fill: ${COLOR};
`;

const StyledToggleButton = styled(ToggleButton)`
  font-size: 0;
  line-height: 0;
  cursor: ${CURSOR};
`;
