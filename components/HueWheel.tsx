import type { SkPath } from "@shopify/react-native-skia";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Shadow,
  Skia,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import {
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

export type HueWheelProps = {
  sections: string[];
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
  innerRadiusRatio = 0.6,
  shadowOffsetX = 4,
  shadowOffsetY = 0,
  shadowBlur = 4,
  shadowOpacity = 1,
  sectionColors,
}: HueWheelProps) {
  const [size, setSize] = useState(0);
  const hasSections = sections && sections.length > 0;
  const sectionsCount = hasSections ? sections.length : 1;
  const startAngleDeg = -90;
  const angleStepDeg = 360 / sectionsCount;

  const dims = useMemo(() => {
    const canvasSize = size || 1;
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const outerRadius = canvasSize * 0.48;
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

  function hexToRgba(hex: string, alpha: number) {
    const normalized = hex.replace("#", "");
    const red = parseInt(normalized.slice(0, 2), 16);
    const green = parseInt(normalized.slice(2, 4), 16);
    const blue = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${red},${green},${blue},${alpha})`;
  }

  const segments = useMemo((): Array<{
    id: string;
    color: string;
    bodyPath: SkPath;
    tipPath: SkPath;
    tipCenterDeg: number;
  }> => {
    const list: Array<{
      id: string;
      color: string;
      bodyPath: SkPath;
      tipPath: SkPath;
      tipCenterDeg: number;
    }> = [];
    for (let index = 0; index < sectionsCount; index += 1) {
      const sectionId = hasSections ? sections[index] : "single";
      const centerHue = ((index + 0.5) * 360) / sectionsCount;
      const defaultColor = hslToHex(centerHue % 360, 0.85, 0.5);
      const color = sectionColors?.[sectionId] ?? defaultColor;
      const startDeg = startAngleDeg + index * angleStepDeg;
      const endDeg = startAngleDeg + (index + 1) * angleStepDeg;
      const tipDeg = 0;

      const bodyStartDeg = startDeg;
      const bodySweepDeg = Math.max(0, endDeg - startDeg - tipDeg);
      const tipStartDeg = endDeg - tipDeg;
      const tipSweepDeg = tipDeg;
      const tipCenterDeg = tipStartDeg + tipSweepDeg / 2;

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
      });
    }
    return list;
  }, [sections, sectionsCount, hasSections, dims, startAngleDeg, angleStepDeg]);

  function handleRelease(e: GestureResponderEvent) {
    if (!hasSections || size === 0) return;
    const { locationX, locationY } = e.nativeEvent;
    const dx = locationX - dims.centerX;
    const dy = locationY - dims.centerY;
    const distance = Math.hypot(dx, dy);
    if (distance < dims.innerRadius || distance > dims.outerRadius) return;
    // Prefer tip circle hit-testing to avoid boundary ambiguity
    if (segments.length > 0) {
      let nearestIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < segments.length; i += 1) {
        const angle = (segments[i].tipCenterDeg * Math.PI) / 180;
        const cx = dims.centerX + dims.ringRadius * Math.cos(angle);
        const cy = dims.centerY + dims.ringRadius * Math.sin(angle);
        const d = Math.hypot(locationX - cx, locationY - cy);
        if (d < nearestDistance) {
          nearestDistance = d;
          nearestIndex = i;
        }
      }
      if (nearestIndex >= 0 && nearestDistance <= dims.strokeThickness / 2) {
        const sectionId = sections[nearestIndex];
        if (sectionId) onSectionClick(sectionId);
        return;
      }
    }
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI;
    angleDeg = (angleDeg - startAngleDeg + 360) % 360;
    const index =
      Math.floor((angleDeg + 0.000001) / angleStepDeg) % sectionsCount;
    const sectionId = sections[index];
    if (sectionId) onSectionClick(sectionId);
  }

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
            {segments.map((seg) => (
              <Path
                key={`body-${seg.id}`}
                path={seg.bodyPath}
                color={seg.color}
                style="stroke"
                strokeWidth={dims.strokeThickness}
                strokeCap="butt"
                strokeJoin="round"
              />
            ))}
            {segments.map((seg) => (
              <Group key={`tip-${seg.id}`}>
                <Shadow
                  dx={
                    shadowOffsetX *
                      -Math.sin((seg.tipCenterDeg * Math.PI) / 180) +
                    shadowOffsetY * Math.cos((seg.tipCenterDeg * Math.PI) / 180)
                  }
                  dy={
                    shadowOffsetX *
                      Math.cos((seg.tipCenterDeg * Math.PI) / 180) +
                    shadowOffsetY * Math.sin((seg.tipCenterDeg * Math.PI) / 180)
                  }
                  blur={shadowBlur}
                  color={hexToRgba(seg.color, shadowOpacity)}
                />
                <Circle
                  cx={
                    dims.centerX +
                    dims.ringRadius *
                      Math.cos((seg.tipCenterDeg * Math.PI) / 180)
                  }
                  cy={
                    dims.centerY +
                    dims.ringRadius *
                      Math.sin((seg.tipCenterDeg * Math.PI) / 180)
                  }
                  r={dims.strokeThickness / 2}
                  color={seg.color}
                />
              </Group>
            ))}
          </Group>
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "45%",
    aspectRatio: 1 / 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
