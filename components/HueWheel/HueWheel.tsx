import { Canvas, Group, Path, Shadow, Skia } from "@shopify/react-native-skia";
import { Fragment, useMemo } from "react";
import {
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Knob } from "./Knob";
import { Segment, type SegmentData } from "./Segment";

export type HueWheelProps = {
  sections: Record<string, string>;
  onSectionClick: (section: string) => void;
  style?: StyleProp<ViewStyle>;
  colorStripThickness?: number;
  shadowOffset?: number;
  innerBlur?: number;
  outerBlur?: number;
};

export function HueWheel({
  sections,
  onSectionClick,
  style,
  colorStripThickness = 0.65,
  shadowOffset = 10,
  innerBlur = 3,
  outerBlur = 20,
}: HueWheelProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const sectionIds = useMemo(() => Object.keys(sections), [sections]);
  const startAngleDeg = -90;
  const angleStepDeg = 360 / sectionIds.length;

  const dimensions = useMemo(() => {
    const centerX = windowWidth / 2;
    const centerY = windowWidth / 2;
    const outerRadius = windowWidth / 2.3;
    const innerRadius = Math.max(
      0,
      Math.min(outerRadius - 1, outerRadius * colorStripThickness),
    );
    const strokeThickness = outerRadius - innerRadius;
    const ringRadius = innerRadius + strokeThickness / 2;
    return {
      centerX,
      centerY,
      outerRadius,
      innerRadius,
      strokeThickness,
      ringRadius,
    };
  }, [windowWidth, colorStripThickness]);

  const segments = useMemo(
    (): SegmentData[] =>
      sectionIds.map((id, index) => {
        const color = sections[id];
        const start = startAngleDeg + index * angleStepDeg;
        const end = startAngleDeg + (index + 1) * angleStepDeg;

        const bodyStart = start;
        const bodySweep = Math.max(0, end - start);
        const center = (start + end) / 2;

        const circleRect = Skia.XYWHRect(
          dimensions.centerX - dimensions.ringRadius,
          dimensions.centerY - dimensions.ringRadius,
          dimensions.ringRadius * 2,
          dimensions.ringRadius * 2,
        );
        const bodyPath = Skia.Path.Make();
        if (bodySweep > 0.0001) {
          bodyPath.addArc(circleRect, bodyStart, bodySweep);
        }

        return { id, color, bodyPath, center, bodyStart, bodySweep };
      }),
    [sections, sectionIds, dimensions, startAngleDeg, angleStepDeg],
  );

  const ringShadowPath = useMemo(() => {
    const rect = Skia.XYWHRect(
      dimensions.centerX - dimensions.ringRadius,
      dimensions.centerY - dimensions.ringRadius,
      dimensions.ringRadius * 2,
      dimensions.ringRadius * 2,
    );
    const path = Skia.Path.Make();
    const shadowStartDeg = -10;
    const shadowSweepDeg = 140;
    path.addArc(rect, shadowStartDeg, shadowSweepDeg);
    return path;
  }, [dimensions]);

  function handleRelease(event: GestureResponderEvent) {
    const { locationX, locationY } = event.nativeEvent;
    const changeX = locationX - dimensions.centerX;
    const changeY = locationY - dimensions.centerY;
    const distance = Math.hypot(changeX, changeY);
    if (distance < dimensions.innerRadius || distance > dimensions.outerRadius)
      return;
    const angleRad = Math.atan2(changeY, changeX);
    let angleDeg = (angleRad * 180) / Math.PI;
    angleDeg = (angleDeg - startAngleDeg + 360) % 360;
    const index =
      Math.floor((angleDeg + 0.000001) / angleStepDeg) % sectionIds.length;
    const sectionId = segments[index]?.id;
    if (sectionId) onSectionClick(sectionId);
  }

  return (
    <View
      style={[styles.container, { width: windowWidth }, style]}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleRelease}
    >
      <Canvas style={{ width: "100%", height: "100%" }}>
        <Group>
          <Path
            path={ringShadowPath}
            style="stroke"
            strokeWidth={dimensions.strokeThickness}
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
          {segments.map((segment) => (
            <Fragment key={`segment-cap-${segment.id}`}>
              <Path
                path={segment.bodyPath}
                style="stroke"
                strokeWidth={dimensions.strokeThickness}
                strokeCap="butt"
                strokeJoin="round"
              >
                <Shadow
                  dx={0}
                  dy={0}
                  blur={4}
                  color={segment.color}
                  shadowOnly
                />
              </Path>
              <Path
                path={segment.bodyPath}
                color={segment.color}
                style="stroke"
                strokeWidth={dimensions.strokeThickness}
                strokeCap="butt"
                strokeJoin="round"
              />
            </Fragment>
          ))}
          {segments.map((segment, index) => (
            <Segment
              key={`segment-${segment.id}`}
              segment={segment}
              nextSegment={segments[(index + 1) % segments.length]}
              angleStep={angleStepDeg}
              centerX={dimensions.centerX}
              centerY={dimensions.centerY}
              ringRadius={dimensions.ringRadius}
              strokeThickness={dimensions.strokeThickness}
            />
          ))}
        </Group>
        <Knob
          centerX={dimensions.centerX}
          centerY={dimensions.centerY}
          outerBlur={outerBlur}
          innerBlur={innerBlur}
          radius={dimensions.ringRadius}
          offset={shadowOffset}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1 / 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
