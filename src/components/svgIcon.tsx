import styled from 'styled-components'

const StyledSvg = styled.svg`
  fill: ${(props) => props.fill};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  vertical-align: bottom;
`

interface Props {
  viewBox?: string
  width: string
  height: string
  fill: string
  paths: ReadonlyArray<string>
}

const SvgIcon = ({ viewBox, width, height, fill, paths }: Props) => (
  <StyledSvg
    viewBox={viewBox || '0 0 24 24'}
    width={width}
    height={height}
    fill={fill}
  >
    <g>
      {paths.map((path) => (
        <path key={path} d={path}></path>
      ))}
    </g>
  </StyledSvg>
)

export default SvgIcon
