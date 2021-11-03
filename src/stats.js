export const webRTCStats = () => {
  let value = 0
  let interval = null

  // let browser = env.getBrowser();
  // let label = 'FrameDelay'
  // if (browser === 'firefox') {
  //     label = 'FramerateMean'
  // }
  // const ui = moduleUi(label, false, () => '');
  // const self = {}

  let container

  const createContainer = () => {
    if (container) return container
    const rtcStats = document.createElement('div')
    document.body.appendChild(rtcStats)
    rtcStats.style.position = 'absolute'
    rtcStats.style.width = '200px'
    rtcStats.style.top = '10px'
    rtcStats.style.right = '10px'
    rtcStats.style.background = 'black'
    rtcStats.style.color = 'white'
    container = rtcStats
    return container
  }

  const render = (text) => {
    if (!text) debugger
    const renderContainer = createContainer()
    renderContainer.innerHTML = text
  }

  const generateAggregatedStatsFunction = function () {
    if (!self.aggregatedStats) {
      self.aggregatedStats = {}
    }

    return function (stats) {
      // console.log('Printing Stats');

      const newStat = {}
      // console.log('----------------------------- Stats start -----------------------------');
      stats.forEach((stat) => {
        //                    console.log(JSON.stringify(stat, undefined, 4));
        if (
          stat.type == 'inbound-rtp' &&
          !stat.isRemote &&
          (stat.mediaType == 'video' || stat.id.toLowerCase().includes('video'))
        ) {
          newStat.timestamp = stat.timestamp
          newStat.bytesReceived = stat.bytesReceived
          newStat.framesDecoded = stat.framesDecoded
          newStat.packetsLost = stat.packetsLost
          newStat.bytesReceivedStart =
            self.aggregatedStats && self.aggregatedStats.bytesReceivedStart
              ? self.aggregatedStats.bytesReceivedStart
              : stat.bytesReceived
          newStat.framesDecodedStart =
            self.aggregatedStats && self.aggregatedStats.framesDecodedStart
              ? self.aggregatedStats.framesDecodedStart
              : stat.framesDecoded
          newStat.timestampStart =
            self.aggregatedStats && self.aggregatedStats.timestampStart
              ? self.aggregatedStats.timestampStart
              : stat.timestamp

          if (self.aggregatedStats && self.aggregatedStats.timestamp) {
            if (self.aggregatedStats.bytesReceived) {
              // bitrate = bits received since last time / number of ms since last time
              // This is automatically in kbits (where k=1000) since time is in ms and stat we want is in seconds (so a '* 1000' then a '/ 1000' would negate each other)
              newStat.bitrate =
                (8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceived)) /
                (newStat.timestamp - self.aggregatedStats.timestamp)
              newStat.bitrate = Math.floor(newStat.bitrate)
              newStat.lowBitrate =
                self.aggregatedStats.lowBitrate && self.aggregatedStats.lowBitrate < newStat.bitrate
                  ? self.aggregatedStats.lowBitrate
                  : newStat.bitrate
              newStat.highBitrate =
                self.aggregatedStats.highBitrate && self.aggregatedStats.highBitrate > newStat.bitrate
                  ? self.aggregatedStats.highBitrate
                  : newStat.bitrate
            }

            if (self.aggregatedStats.bytesReceivedStart) {
              newStat.avgBitrate =
                (8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceivedStart)) /
                (newStat.timestamp - self.aggregatedStats.timestampStart)
              newStat.avgBitrate = Math.floor(newStat.avgBitrate)
            }

            if (self.aggregatedStats.framesDecoded) {
              // framerate = frames decoded since last time / number of seconds since last time
              newStat.framerate =
                (newStat.framesDecoded - self.aggregatedStats.framesDecoded) /
                ((newStat.timestamp - self.aggregatedStats.timestamp) / 1000)
              newStat.framerate = Math.floor(newStat.framerate)
              newStat.lowFramerate =
                self.aggregatedStats.lowFramerate && self.aggregatedStats.lowFramerate < newStat.framerate
                  ? self.aggregatedStats.lowFramerate
                  : newStat.framerate
              newStat.highFramerate =
                self.aggregatedStats.highFramerate && self.aggregatedStats.highFramerate > newStat.framerate
                  ? self.aggregatedStats.highFramerate
                  : newStat.framerate
            }

            if (self.aggregatedStats.framesDecodedStart) {
              newStat.avgframerate =
                (newStat.framesDecoded - self.aggregatedStats.framesDecodedStart) /
                ((newStat.timestamp - self.aggregatedStats.timestampStart) / 1000)
              newStat.avgframerate = Math.floor(newStat.avgframerate)
            }
          }
        }

        // Read video track stats
        if (stat.type == 'track' && (stat.trackIdentifier == 'video_label' || stat.kind == 'video')) {
          newStat.framesDropped = stat.framesDropped
          newStat.framesReceived = stat.framesReceived
          newStat.framesDroppedPercentage = (stat.framesDropped / stat.framesReceived) * 100
          newStat.frameHeight = stat.frameHeight
          newStat.frameWidth = stat.frameWidth
          newStat.frameHeightStart =
            self.aggregatedStats && self.aggregatedStats.frameHeightStart
              ? self.aggregatedStats.frameHeightStart
              : stat.frameHeight
          newStat.frameWidthStart =
            self.aggregatedStats && self.aggregatedStats.frameWidthStart
              ? self.aggregatedStats.frameWidthStart
              : stat.frameWidth
        }

        if (
          stat.type == 'candidate-pair' &&
          stat.hasOwnProperty('currentRoundTripTime') &&
          stat.currentRoundTripTime != 0
        ) {
          newStat.currentRoundTripTime = stat.currentRoundTripTime
        }
      })

      // console.log(JSON.stringify(newStat));
      self.aggregatedStats = newStat

      // if (self.onAggregatedStats)
      onAggregatedStats(newStat)
    }
  }

  const onAggregatedStats = (aggregatedStats) => {
    const numberFormat = new Intl.NumberFormat(window.navigator.language, {
      maximumFractionDigits: 0,
    })
    const timeFormat = new Intl.NumberFormat(window.navigator.language, {
      maximumFractionDigits: 0,
      minimumIntegerDigits: 2,
    })
    let statsText = ''

    // Calculate duration of run
    let runTime = (aggregatedStats.timestamp - aggregatedStats.timestampStart) / 1000
    const timeValues = []
    const timeDurations = [60, 60]
    for (let timeIndex = 0; timeIndex < timeDurations.length; timeIndex++) {
      timeValues.push(runTime % timeDurations[timeIndex])
      runTime = runTime / timeDurations[timeIndex]
    }
    timeValues.push(runTime)

    const runTimeSeconds = timeValues[0]
    const runTimeMinutes = Math.floor(timeValues[1])
    const runTimeHours = Math.floor([timeValues[2]])

    let receivedBytesMeasurement = 'B'
    let receivedBytes = aggregatedStats.hasOwnProperty('bytesReceived') ? aggregatedStats.bytesReceived : 0
    const dataMeasurements = ['kB', 'MB', 'GB']
    for (let index = 0; index < dataMeasurements.length; index++) {
      if (receivedBytes < 100 * 1000) {
        break
      }
      receivedBytes = receivedBytes / 1000
      receivedBytesMeasurement = dataMeasurements[index]
    }

    statsText += `Duration: ${timeFormat.format(runTimeHours)}:${timeFormat.format(runTimeMinutes)}:${timeFormat.format(
      runTimeSeconds,
    )}</br>`
    statsText += `Video Resolution: ${
      aggregatedStats.hasOwnProperty('frameWidth') &&
      aggregatedStats.frameWidth &&
      aggregatedStats.hasOwnProperty('frameHeight') &&
      aggregatedStats.frameHeight
        ? aggregatedStats.frameWidth + 'x' + aggregatedStats.frameHeight
        : 'N/A'
    }</br>`
    statsText += `Received (${receivedBytesMeasurement}): ${numberFormat.format(receivedBytes)}</br>`
    statsText += `Frames Decoded: ${
      aggregatedStats.hasOwnProperty('framesDecoded') ? numberFormat.format(aggregatedStats.framesDecoded) : 'N/A'
    }</br>`
    statsText += `Packets Lost: ${
      aggregatedStats.hasOwnProperty('packetsLost') ? numberFormat.format(aggregatedStats.packetsLost) : 'N/A'
    }</br>`
    statsText += `Bitrate (kbps): ${
      aggregatedStats.hasOwnProperty('bitrate') ? numberFormat.format(aggregatedStats.bitrate) : 'N/A'
    }</br>`
    statsText += `Framerate: ${
      aggregatedStats.hasOwnProperty('framerate') ? numberFormat.format(aggregatedStats.framerate) : 'N/A'
    }</br>`
    statsText += `Frames dropped: ${
      aggregatedStats.hasOwnProperty('framesDropped') ? numberFormat.format(aggregatedStats.framesDropped) : 'N/A'
    }</br>`
    statsText += `Latency (ms): ${
      aggregatedStats.hasOwnProperty('currentRoundTripTime')
        ? numberFormat.format(aggregatedStats.currentRoundTripTime * 1000)
        : 'N/A'
    }</br>`

    // let statsDiv = document.getElementById("stats");
    // if (statsDiv) {
    //     statsDiv.innerHTML = statsText;
    // }
    render(statsText)

    // if (print_stats) {
    //     if (aggregatedStats.timestampStart) {
    //         if ((aggregatedStats.timestamp - aggregatedStats.timestampStart) > nextPrintDuration) {
    //             if (ws && ws.readyState === WS_OPEN_STATE) {
    //                 console.log(`-> SS: stats\n${JSON.stringify(aggregatedStats)}`);
    //                 ws.send(JSON.stringify({
    //                     type: 'stats',
    //                     data: aggregatedStats
    //                 }));
    //             }
    //             nextPrintDuration += printInterval;
    //         }
    //     }
    // }
  }

  const enable = (connection) => {
    const calcAggregatedStats = generateAggregatedStatsFunction()
    const printStats = () => {
      getStats(calcAggregatedStats, connection)
    }
    interval = window.setInterval(printStats, 1000)
  }

  const disable = () => {
    window.clearInterval(interval)
    value = 0
  }

  function getStats(onStats, peerConnection) {
    peerConnection.getStats(null).then((stats) => {
      onStats(stats)
      // stats.forEach(report => {
      //     if (report["framesReceived"] !== undefined && report["framesDecoded"] !== undefined && report["framesDropped"] !== undefined) {
      //         value = report["framesReceived"] - report["framesDecoded"] - report["framesDropped"];
      //     } else if (report["framerateMean"] !== undefined) {
      //         value = Math.round(report["framerateMean"]*100)/100;
      //     }
      // });
    })
  }

  return {
    enable,
    disable,
    render,
  }
}
