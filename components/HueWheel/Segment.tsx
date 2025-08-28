import {
  LinearGradient,
  Path,
  Skia,
  type SkPath,
  vec,
} from "@shopify/react-native-skia";

export type SegmentData = {
  id: string;
  color: string;
  bodyPath: SkPath;
  center: number;
  bodyStart: number;
  bodySweep: number;
};

type SegmentProps = {
  segment: SegmentData;
  nextSegment: SegmentData;
  angleStep: number;
  centerX: number;
  centerY: number;
  ringRadius: number;
  strokeThickness: number;
};

export const Segment: React.FC<SegmentProps> = ({
  segment,
  nextSegment,
  angleStep,
  centerX,
  centerY,
  ringRadius,
  strokeThickness,
}) => {
  const end = segment.bodyStart + segment.bodySweep;
  const feather = Math.min(20, angleStep * 0.6);
  const rect = Skia.XYWHRect(
    centerX - ringRadius,
    centerY - ringRadius,
    ringRadius * 2,
    ringRadius * 2,
  );
  const blendPath = Skia.Path.Make();
  blendPath.addArc(rect, end - feather, feather * 2);

  const makePoint = (deg: number) =>
    vec(
      centerX + ringRadius * Math.cos((deg * Math.PI) / 180),
      centerY + ringRadius * Math.sin((deg * Math.PI) / 180),
    );
  const startPoint = makePoint(end - feather);
  const endPoint = makePoint(end + feather);

  return (
    <Path
      path={blendPath}
      style="stroke"
      strokeWidth={strokeThickness}
      strokeCap="butt"
      strokeJoin="round"
    >
      <LinearGradient
        start={startPoint}
        end={endPoint}
        colors={[segment.color, nextSegment.color]}
      />
    </Path>
  );
};
