import type { SkPath } from "@shopify/react-native-skia";
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  Shadow,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import {
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";

export type HueWheelProps = {
  sections: Record<string, string>;
  onSectionClick: (section: string) => void;
  style?: StyleProp<ViewStyle>;
  innerRadiusRatio?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowOpacity?: number;
  sectionColors?: Record<string, string>;
};

export function HueWheel({
  sections,
  onSectionClick,
  style,
  innerRadiusRatio = 0.7,
}: HueWheelProps) {
  const theme = useTheme();

  const [size, setSize] = useState(0);
  const hasSections = sections && Object.keys(sections).length > 0;
  const sectionIds = useMemo(() => Object.keys(sections ?? {}), [sections]);
  const sectionsCount = hasSections ? sectionIds.length : 1;
  const startAngleDeg = -90;
  const angleStepDeg = 360 / sectionsCount;

  const dims = useMemo(() => {
    const canvasSize = size || 1;
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const outerRadius = canvasSize / 2.5;
    const innerRadius = Math.max(
      0,
      Math.min(outerRadius - 1, outerRadius * innerRadiusRatio),
    );
    const strokeThickness = outerRadius - innerRadius;
    const ringRadius = innerRadius + strokeThickness / 2;
    return {
      canvasSize,
      centerX,
      centerY,
      outerRadius,
      innerRadius,
      strokeThickness,
      ringRadius,
    };
  }, [size, innerRadiusRatio]);

  function hslToHex(hueDegrees: number, saturation: number, lightness: number) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const huePrime = hueDegrees / 60;
    const secondary = chroma * (1 - Math.abs((huePrime % 2) - 1));
    let redPrime = 0;
    let greenPrime = 0;
    let bluePrime = 0;
    if (huePrime >= 0 && huePrime < 1) {
      redPrime = chroma;
      greenPrime = secondary;
    } else if (huePrime >= 1 && huePrime < 2) {
      redPrime = secondary;
      greenPrime = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
      greenPrime = chroma;
      bluePrime = secondary;
    } else if (huePrime >= 3 && huePrime < 4) {
      greenPrime = secondary;
      bluePrime = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      redPrime = secondary;
      bluePrime = chroma;
    } else {
      redPrime = chroma;
      bluePrime = secondary;
    }
    const match = lightness - chroma / 2;
    const red = Math.round((redPrime + match) * 255);
    const green = Math.round((greenPrime + match) * 255);
    const blue = Math.round((bluePrime + match) * 255);
    const toHex = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  }

  const segments = useMemo((): Array<{
    id: string;
    color: string;
    bodyPath: SkPath;
    tipPath: SkPath;
    tipCenterDeg: number;
    centerDeg: number;
    bodyStartDeg: number;
    bodySweepDeg: number;
  }> => {
    const list: Array<{
      id: string;
      color: string;
      bodyPath: SkPath;
      tipPath: SkPath;
      tipCenterDeg: number;
      centerDeg: number;
      bodyStartDeg: number;
      bodySweepDeg: number;
    }> = [];
    for (let index = 0; index < sectionsCount; index += 1) {
      const sectionId = hasSections ? sectionIds[index] : "single";
      const centerHue = ((index + 0.5) * 360) / sectionsCount;
      const defaultColor = hslToHex(centerHue % 360, 0.85, 0.5);
      const color = hasSections
        ? (sections[sectionId] ?? defaultColor)
        : defaultColor;
      const startDeg = startAngleDeg + index * angleStepDeg;
      const endDeg = startAngleDeg + (index + 1) * angleStepDeg;
      const tipDeg = 0;

      const bodyStartDeg = startDeg;
      const bodySweepDeg = Math.max(0, endDeg - startDeg - tipDeg);
      const tipStartDeg = endDeg - tipDeg;
      const tipSweepDeg = tipDeg;
      const tipCenterDeg = tipStartDeg + tipSweepDeg / 2;
      const centerDeg = (startDeg + endDeg) / 2;

      const circleRect = Skia.XYWHRect(
        dims.centerX - dims.ringRadius,
        dims.centerY - dims.ringRadius,
        dims.ringRadius * 2,
        dims.ringRadius * 2,
      );
      const bodyPath = Skia.Path.Make();
      if (bodySweepDeg > 0.0001)
        bodyPath.addArc(circleRect, bodyStartDeg, bodySweepDeg);
      const tipPath = Skia.Path.Make();
      tipPath.addArc(circleRect, tipStartDeg, tipSweepDeg);

      list.push({
        id: sectionId,
        color,
        bodyPath,
        tipPath,
        tipCenterDeg,
        centerDeg,
        bodyStartDeg,
        bodySweepDeg,
      });
    }
    return list;
  }, [sections, sectionsCount, hasSections, dims, startAngleDeg, angleStepDeg]);

  const ringShadowPath = useMemo(() => {
    const rect = Skia.XYWHRect(
      dims.centerX - dims.ringRadius,
      dims.centerY - dims.ringRadius,
      dims.ringRadius * 2,
      dims.ringRadius * 2,
    );
    const path = Skia.Path.Make();
    const shadowStartDeg = -10;
    const shadowSweepDeg = 140;
    path.addArc(rect, shadowStartDeg, shadowSweepDeg);
    return path;
  }, [dims]);

  function handleRelease(e: GestureResponderEvent) {
    if (!hasSections || size === 0) return;
    const { locationX, locationY } = e.nativeEvent;
    const dx = locationX - dims.centerX;
    const dy = locationY - dims.centerY;
    const distance = Math.hypot(dx, dy);
    if (distance < dims.innerRadius || distance > dims.outerRadius) return;
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI;
    angleDeg = (angleDeg - startAngleDeg + 360) % 360;
    const index =
      Math.floor((angleDeg + 0.000001) / angleStepDeg) % sectionsCount;
    const sectionId = segments[index]?.id;
    if (sectionId) onSectionClick(sectionId);
  }

  const startEndFromShadows = (
    cx: number,
    cy: number,
    r: number,
    a: { dx: number; dy: number },
    b: { dx: number; dy: number },
  ) => {
    const vx = b.dx - a.dx,
      vy = b.dy - a.dy;
    const L = Math.hypot(vx, vy) || 1;
    const ux = vx / L,
      uy = vy / L; // unit vector from a -> b
    return {
      start: vec(cx - ux * r, cy - uy * r), // toward shadow A side
      end: vec(cx + ux * r, cy + uy * r), // toward shadow B side
    };
  };

  const a = { dx: -20, dy: -20 };
  const b = { dx: 20, dy: 20 };
  const { start, end } = startEndFromShadows(
    dims.centerX,
    dims.centerY,
    60,
    a,
    b,
  );

  const outerBlur = 20;
  const innerBlur = 3;

  return (
    <View
      style={[styles.container, style]}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleRelease}
      onLayout={(e) => {
        const side = Math.min(
          e.nativeEvent.layout.width,
          e.nativeEvent.layout.height,
        );
        if (side > 0) setSize(side);
      }}
    >
      {size > 0 && (
        <Canvas style={{ width: "100%", height: "100%" }}>
          <Group>
            <Path
              path={ringShadowPath}
              style="stroke"
              strokeWidth={dims.strokeThickness}
              strokeCap="butt"
              strokeJoin="round"
            >
              <Shadow
                dx={10}
                dy={10}
                blur={15}
                color={theme.colors.outerDark}
                shadowOnly
              />
            </Path>
            {segments.map((seg) => (
              <Path
                key={`glow-${seg.id}`}
                path={seg.bodyPath}
                style="stroke"
                strokeWidth={dims.strokeThickness}
                strokeCap="butt"
                strokeJoin="round"
              >
                <Shadow dx={0} dy={0} blur={4} color={seg.color} shadowOnly />
              </Path>
            ))}
            {segments.map((seg) => (
              <Path
                key={`seg-${seg.id}`}
                path={seg.bodyPath}
                color={seg.color}
                style="stroke"
                strokeWidth={dims.strokeThickness}
                strokeCap="butt"
                strokeJoin="round"
              />
            ))}
            {segments.map((seg, index) => {
              const endDeg = seg.bodyStartDeg + seg.bodySweepDeg;
              const featherDeg = Math.min(20, angleStepDeg * 0.6);
              const next = segments[(index + 1) % segments.length];
              const rect = Skia.XYWHRect(
                dims.centerX - dims.ringRadius,
                dims.centerY - dims.ringRadius,
                dims.ringRadius * 2,
                dims.ringRadius * 2,
              );
              const blendPath = Skia.Path.Make();
              blendPath.addArc(rect, endDeg - featherDeg, featherDeg * 2);
              const startPoint = vec(
                dims.centerX +
                  dims.ringRadius *
                    Math.cos(((endDeg - featherDeg) * Math.PI) / 180),
                dims.centerY +
                  dims.ringRadius *
                    Math.sin(((endDeg - featherDeg) * Math.PI) / 180),
              );
              const endPoint = vec(
                dims.centerX +
                  dims.ringRadius *
                    Math.cos(((endDeg + featherDeg) * Math.PI) / 180),
                dims.centerY +
                  dims.ringRadius *
                    Math.sin(((endDeg + featherDeg) * Math.PI) / 180),
              );
              return (
                <Path
                  key={`blend-${seg.id}`}
                  path={blendPath}
                  style="stroke"
                  strokeWidth={dims.strokeThickness}
                  strokeCap="butt"
                  strokeJoin="round"
                >
                  <LinearGradient
                    start={startPoint}
                    end={endPoint}
                    colors={[seg.color, next?.color ?? seg.color]}
                  />
                </Path>
              );
            })}
            {null}
          </Group>
          <Group>
            {/* Outer Light Shadow */}
            <Circle
              cx={dims.centerX}
              cy={dims.centerY}
              r={60}
              color={theme.colors.background}
            >
              <Shadow
                dx={-20}
                dy={-20}
                blur={outerBlur}
                color={theme.colors.outerLight}
                shadowOnly
              />
            </Circle>
            {/* Outer Dark Shadow */}
            <Circle
              cx={dims.centerX}
              cy={dims.centerY}
              r={60}
              color={theme.colors.background}
            >
              <Shadow
                dx={20}
                dy={20}
                blur={outerBlur}
                color={theme.colors.outerDark}
                shadowOnly
              />
            </Circle>
            {/* Inner Circle Blur */}
            <Circle
              cx={dims.centerX}
              cy={dims.centerY}
              r={60}
              color={theme.colors.background}
            >
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
            <Circle
              cx={dims.centerX}
              cy={dims.centerY}
              r={60}
              color={theme.colors.background}
            >
              <LinearGradient
                start={start}
                end={end}
                colors={[theme.colors.innerDark, theme.colors.innerLight]}
              />
            </Circle>
          </Group>
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "35%",
    aspectRatio: 1 / 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
