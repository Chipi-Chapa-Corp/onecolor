import {
  Circle,
  Group,
  LinearGradient,
  Path,
  Shadow,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import type React from "react";
import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";

export const KNOB_RADIUS = 50;

type KnobProps = {
  centerX: number;
  centerY: number;
  outerBlur: number;
  innerBlur: number;
  radius: number;
  offset: number;
  withPlus: boolean;
};

export const Knob: React.FC<KnobProps> = ({
  centerX,
  centerY,
  outerBlur,
  innerBlur,
  radius,
  offset,
  withPlus,
}) => {
  const theme = useTheme();

  const { start, end } = useMemo(() => {
    const distanceX = offset * 2;
    const distanceY = offset * 2;
    const length = Math.hypot(distanceX, distanceY) || 1;
    const unitX = distanceX / length;
    const unitY = distanceY / length;
    return {
      start: vec(centerX - unitX * radius, centerY - unitY * radius),
      end: vec(centerX + unitX * radius, centerY + unitY * radius),
    };
  }, [centerX, centerY, radius, offset]);

  const crossSize = 15;

  const path = Skia.Path.Make();
  path.moveTo(centerX - crossSize, centerY);
  path.lineTo(centerX + crossSize, centerY);
  path.moveTo(centerX, centerY - crossSize);
  path.lineTo(centerX, centerY + crossSize);

  return (
    <Group>
      {/* Outer Light Shadow */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={KNOB_RADIUS}
        color={theme.colors.background}
      >
        <Shadow
          dx={-20}
          dy={-20}
          blur={outerBlur}
          color={theme.colors.skeuo.outerLight}
          shadowOnly
        />
      </Circle>
      {/* Outer Dark Shadow */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={KNOB_RADIUS}
        color={theme.colors.background}
      >
        <Shadow
          dx={20}
          dy={20}
          blur={outerBlur}
          color={theme.colors.skeuo.outerDark}
          shadowOnly
        />
      </Circle>
      {/* Inner Circle Blur */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={KNOB_RADIUS}
        color={theme.colors.background}
      >
        <Shadow
          dx={-3}
          dy={-3}
          blur={innerBlur}
          color={theme.colors.skeuo.innerBlurDark}
        />
        <Shadow
          dx={3}
          dy={3}
          blur={innerBlur}
          color={theme.colors.skeuo.innerBlurLight}
        />
      </Circle>
      {/* Inner Circle */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={KNOB_RADIUS}
        color={theme.colors.background}
      >
        <LinearGradient
          start={start}
          end={end}
          colors={[theme.colors.skeuo.innerDark, theme.colors.skeuo.innerLight]}
        />
      </Circle>

      {withPlus && (
        <Path
          path={path}
          style="stroke"
          color={theme.colors.skeuo.innerContent}
          strokeWidth={10}
          strokeCap="round"
          strokeJoin="round"
        >
          <Shadow dx={5} dy={5} blur={5} color={theme.colors.skeuo.innerDark} />
          <Shadow
            dx={-5}
            dy={-5}
            blur={5}
            color={theme.colors.skeuo.innerLight}
          />
        </Path>
      )}
    </Group>
  );
};
