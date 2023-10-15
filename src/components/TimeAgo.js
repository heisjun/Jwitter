import React, { useState, useEffect } from "react";
import moment from "moment";

function TimeAgo({ timestamp }) {
  const [timeAgo, setTimeAgo] = useState(calculateTimeAgo);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(intervalID);
  }, []);

  function calculateTimeAgo() {
    const timestampMoment = moment(timestamp);
    const currentTime = moment();
    const daysAgo = currentTime.diff(timestampMoment, "days");

    if (daysAgo < 1) {
      const minutesAgo = currentTime.diff(timestampMoment, "minutes");
      if (minutesAgo < 1) {
        return "방금 전";
      } else if (minutesAgo < 60) {
        return `${minutesAgo} 분 전`;
      } else {
        const hoursAgo = currentTime.diff(timestampMoment, "hours");
        return `${hoursAgo} 시간 전`;
      }
    } else if (daysAgo < 3) {
      return `${daysAgo} 일 전`;
    } else {
      return timestampMoment.format("YYYY.MM.DD");
    }
  }

  return <span style={{ color: "gray" }}>{timeAgo}</span>;
}

export default TimeAgo;
