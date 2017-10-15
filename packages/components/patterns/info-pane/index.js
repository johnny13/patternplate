const React = require("react");
const styled = require("styled-components").default;
const semver = require("semver");
const text = require("react-addons-text-content");
const { omit } = require("lodash");

const Code = require("../code");
const Link = require("../link");
const Flag = require("../flag");
const Icon = require("../icon");
const Text = require("../text");

module.exports = InfoPane;
module.exports.InnerInfoPane = InnerInfoPane;

const BORDER_RADIUS = 10;

const StyledInfoPane = styled.div`
  position: relative;
  width: 300px;
  min-height: 300px;
  height: 100%;
  box-sizing: border-box;
  border-radius: ${props =>
    props.hermit
      ? `${BORDER_RADIUS}px`
      : `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`};
  border-right: 1px solid ${props => props.theme.border};
  border-right-width: ${props => (props.hermit ? 0 : 1)}px;
  overflow: scroll;
  overflow-x: hidden;
  background: ${props => props.theme.background};
`;

const StyledInnerPane = styled.div`
  position: relative;
  z-index: 1;
  background: ${props => props.theme.background};
`;

const StyledName = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 15px 0 15px;
`;

const StyledToolbar = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 0 15px 10px 15px;
`;

const StyledDisplayName = styled(Text)`
  flex: 1 0 auto;
  color: ${props => props.theme.color};
  margin-right: 10px;
`;

const StyledId = styled(Text)`
  flex: 0 1 auto;
  color: ${props => props.theme.recess};
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledIcon = styled(Icon)`
  flex: 0 0 auto;
  fill: ${props => props.theme.color};
  margin-right: 5px;
`;

const StyledData = styled.table`
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

const StyledDataCell = styled.td`
  box-sizing: border-box;
  height: 30px;
  padding: 4px 6px;
  border-top: 1px solid ${props => props.theme.border};
  &:first-child {
    padding-left: 20px;
  }
  &:last-child {
    text-align: right;
    padding-right: 15px;
  }
`;

const StyledKey = styled(Text)`
  font-weight: bold;
  color: ${props => props.theme.color};
`;

class SearchTrigger extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, href) {
    e.preventDefault();
    e.stopPropagation();

    if (typeof this.props.onClick === "function") {
      this.props.onClick(e, href);
    }
  }

  render() {
    const { props } = this;
    return (
      <Link
        className={props.className}
        onClick={this.handleClick}
        query={{
          "search-enabled": true,
          search: `${props.field}=${props.search}`
        }}
        title={`Search other patterns with ${props.field} "${props.search}"`}
      >
        {props.children}
      </Link>
    );
  }
}

const VERSION_COLOR = props => {
  const v = text(props.children);
  if (!semver.valid(v)) {
    return props.theme.error;
  }
  if (semver.satisfies(v, "<=0.1")) {
    return props.theme.error;
  }
  if (semver.satisfies(v, "> 0.1 < 1")) {
    return props.theme.color;
  }
  return props.theme.success;
};

const StyledVersion = styled(Version)`
  color: ${VERSION_COLOR};
  &:link,
  &:visited {
    text-decoration: none;
    color: ${VERSION_COLOR};
  }
`;

const StyledTag = styled(Tag)`
  display: inline-block;
  padding: 2px 4px;
  margin-top: 1.5px;
  margin-bottom: 1.5px;
  border: 1px solid ${props => props.theme.color};
  border-radius: 3px;
  &:link,
  &:visited,
  &:active {
    text-decoration: none;
    color: ${props => props.theme.color};
  }
  &:nth-child(2n) {
    margin-left: 3px;
  }
`;

const StyledToggleHead = styled(ToggleHead)`
  display: flex;
  align-items: center;
  height: 30px;
  font-weight: bold;
  color: ${props => props.theme.color};
  padding: 3px 15px 3px 20px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.border};
  cursor: pointer;
`;

const StyledToggleBody = styled.div`
  display: flex;
  color: ${props => props.theme.color};
  box-sizing: border-box;
  width: 100%;
  padding: 5px 15px 5px 20px;
  box-sizing: border-box;
  background: ${props => props.theme.background};
`;

const StyledCode = styled(Code)`
  width: 100%;
`;

function InfoPane(props) {
  const { className } = props;
  const innerProps = omit(props, ["className"]);

  return (
    <StyledInfoPane className={className} hermit={props.hermit}>
      <InnerInfoPane {...innerProps} standalone />
    </StyledInfoPane>
  );
}

function InnerInfoPane(props) {
  return (
    <StyledInnerPane standalone={props.standalone} className={props.className}>
      <StyledName>
        <StyledIcon symbol={props.icon} />
        <StyledDisplayName>{props.name}</StyledDisplayName>
        <StyledId>{props.id}</StyledId>
      </StyledName>
      {props.children && <StyledToolbar>{props.children}</StyledToolbar>}
      <StyledData>
        <tbody>
          <tr>
            <StyledDataCell>
              <StyledKey>Version</StyledKey>
            </StyledDataCell>
            <StyledDataCell>
              <StyledVersion field="version" search={props.version}>
                {props.version}
              </StyledVersion>
            </StyledDataCell>
          </tr>
          <tr>
            <StyledDataCell>
              <StyledKey>Flag</StyledKey>
            </StyledDataCell>
            <StyledDataCell>
              <SearchTrigger field="flag" search={props.flag}>
                <Flag>{props.flag}</Flag>
              </SearchTrigger>
            </StyledDataCell>
          </tr>
          {has(props.tags) && (
            <tr>
              <StyledDataCell>
                <StyledKey>Tags</StyledKey>
              </StyledDataCell>
              <StyledDataCell>
                {props.tags.map(t => <StyledTag key={t} tag={t} />)}
              </StyledDataCell>
            </tr>
          )}
          {has(props.envs) &&
            props.envs.length > 1 && (
              <tr>
                <StyledDataCell>
                  <StyledKey>Environment</StyledKey>
                </StyledDataCell>
                <StyledDataCell>
                  <Select
                    name="environment"
                    onChange={props.onEnvChange}
                    value={props.env.name}
                  >
                    {props.envs.map(e => (
                      <option key={e.name} value={e.name}>
                        {e.displayName}
                      </option>
                    ))}
                  </Select>
                </StyledDataCell>
              </tr>
            )}
          {
            <ClickableRow onClick={props.onMountChange}>
              <StyledDataCell>
                <StyledKey>Mount</StyledKey>
              </StyledDataCell>
              <StyledDataCell>
                <input type="checkbox" checked={props.mount} />
              </StyledDataCell>
            </ClickableRow>
          }
        </tbody>
      </StyledData>
      {has(props.dependencies) && (
        <Toggle
          head={`Dependencies (${props.dependencies.length})`}
          enabled={props.dependenciesEnabled}
          name="dependencies"
          onClick={props.onToggle}
        >
          <PatternList>
            {props.dependencies.map(d => (
              <PatternItem key={d.id} pattern={d} />
            ))}
          </PatternList>
        </Toggle>
      )}
      {has(props.dependents) && (
        <Toggle
          head={`Dependents (${props.dependents.length})`}
          enabled={props.dependentsEnabled}
          name="dependents"
          onClick={props.onToggle}
        >
          <PatternList>
            {props.dependents.map(d => <PatternItem key={d.id} pattern={d} />)}
          </PatternList>
        </Toggle>
      )}
      {has(props.demoDependencies) && (
        <Toggle
          head={`Demo Dependencies (${props.demoDependencies.length})`}
          enabled={props.demoDependenciesEnabled}
          name="demo-dependencies"
          onClick={props.onToggle}
        >
          <PatternList>
            {props.demoDependencies.map(d => (
              <PatternItem key={d.id} pattern={d} />
            ))}
          </PatternList>
        </Toggle>
      )}
      {has(props.demoDependents) && (
        <Toggle
          head={`Demo Dependents (${props.demoDependents.length})`}
          enabled={props.demoDependentsEnabled}
          name="demo-dependents"
          onClick={props.onToggle}
        >
          <PatternList>
            {props.demoDependents.map(d => (
              <PatternItem key={d.id} pattern={d} />
            ))}
          </PatternList>
        </Toggle>
      )}
      <Toggle
        head="Manifest"
        enabled={props.manifestEnabled}
        name="manifest"
        onClick={props.onToggle}
      >
        <StyledCode block language="json">
          {props.manifest}
        </StyledCode>
      </Toggle>
    </StyledInnerPane>
  );
}

const ClickableRow = styled.tr`
  cursor: pointer;
`;

const StyledSelectContainer = styled.div`
  position: relative;
  &::after {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 1;
    content: "▼";
    font-size: 0.8em;
    color: ${props => props.theme.color};
    transform: translateY(-50%);
  }
`;

const StyledSelect = styled.select`
  position: relative;
  z-index: 2;
  appearance: none;
  color: ${props => props.theme.color};
  background: transparent;
  font-size: 16px;
  border: none;
  border-radius: none;
  padding-right: 20px;
  &:focus {
    outline: none;
  }
`;

function Select(props) {
  return (
    <StyledSelectContainer className={props.className}>
      <StyledSelect onChange={props.onChange} value={props.value}>
        {props.children}
      </StyledSelect>
    </StyledSelectContainer>
  );
}

function Version(props) {
  return (
    <SearchTrigger
      className={props.className}
      search={props.search}
      field="version"
    >
      <Text>{props.search}</Text>
    </SearchTrigger>
  );
}

function Tag(props) {
  return (
    <SearchTrigger className={props.className} search={props.tag} field="tags">
      <Text>{props.tag}</Text>
    </SearchTrigger>
  );
}

const StyledArrow = styled(Text)`
  font-size: 0.8em;
  transform: ${props => (props.rotated ? `rotate(0deg)` : `rotate(-90deg)`)};
`;

const StyledHead = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
`;

const noop = () => {};

function ToggleHead(props) {
  const query = { [`${props.name}-enabled`]: !props.enabled };
  return (
    <StyledHead
      query={query}
      className={props.className}
      title={`${props.enabled ? "Hide" : "Show"} ${props.name}`}
      onClick={
        props.onClick
          ? () => {
              props.onClick(query);
            }
          : noop
      }
    >
      <Text>{props.children}</Text>
      <StyledArrow rotated={props.enabled}>▼</StyledArrow>
    </StyledHead>
  );
}

const StyledPatternList = styled.div`
  width: 100%;
`;

function PatternList(props) {
  return <StyledPatternList>{props.children}</StyledPatternList>;
}

const StyledPatternItem = styled(Link)`
  display: block;
  color: ${props => props.theme.color};
  text-decoration: none;
  padding: 3px 0;
`;

function PatternItem(props) {
  return (
    <StyledPatternItem
      href={`pattern/${props.pattern.id}`}
      data-id={props.pattern.id}
    >
      <Text>{props.pattern.manifest.displayName}</Text>
    </StyledPatternItem>
  );
}

const StyledToggle = styled.div`
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 30px;
`;

function Toggle(props) {
  return (
    <StyledToggle>
      <StyledToggleHead
        name={props.name}
        enabled={props.enabled}
        onClick={props.onClick}
      >
        {props.head}
      </StyledToggleHead>
      {props.enabled && <StyledToggleBody>{props.children}</StyledToggleBody>}
    </StyledToggle>
  );
}

function has(val) {
  return Array.isArray(val) && val.length > 0;
}
