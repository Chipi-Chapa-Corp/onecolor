import {
  Circle,
  Group,
  LinearGradient,
  Shadow,
  vec,
} from "@shopify/react-native-skia";
import type React from "react";
import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";

type KnobProps = {
  centerX: number;
  centerY: number;
  outerBlur: number;
  innerBlur: number;
  radius: number;
  offset: number;
};

export const Knob: React.FC<KnobProps> = ({
  centerX,
  centerY,
  outerBlur,
  innerBlur,
  radius,
  offset,
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

  return (
    <Group>
      {/* Outer Light Shadow */}
      <Circle cx={centerX} cy={centerY} r={50} color={theme.colors.background}>
        <Shadow
          dx={-20}
          dy={-20}
          blur={outerBlur}
          color={theme.colors.outerLight}
          shadowOnly
        />
      </Circle>
      {/* Outer Dark Shadow */}
      <Circle cx={centerX} cy={centerY} r={50} color={theme.colors.background}>
        <Shadow
          dx={20}
          dy={20}
          blur={outerBlur}
          color={theme.colors.outerDark}
          shadowOnly
        />
      </Circle>
      {/* Inner Circle Blur */}
      <Circle cx={centerX} cy={centerY} r={50} color={theme.colors.background}>
        <Shadow
          dx={-3}
          dy={-3}
          blur={innerBlur}
          color={theme.colors.innerBlurDark}
        />
        <Shadow
          dx={3}
          dy={3}
          blur={innerBlur}
          color={theme.colors.innerBlurLight}
        />
      </Circle>
      {/* Inner Circle */}
      <Circle cx={centerX} cy={centerY} r={50} color={theme.colors.background}>
        <LinearGradient
          start={start}
          end={end}
          colors={[theme.colors.innerDark, theme.colors.innerLight]}
        />
      </Circle>
    </Group>
  );
};
