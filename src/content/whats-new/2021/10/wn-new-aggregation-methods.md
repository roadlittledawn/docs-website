---
title: 'New aggregation methods for NRQL alert conditions'
summary: 'Flexibility on aggregation methods provide fewer false alerts and improved incident time to detection.'
releaseDate: '2021-10-25'
learnMoreLink: 'https://discuss.newrelic.com/t/new-aggregation-methods-for-nrql-alert-conditions/158831'
---

Data latency has caused many users to have inaccurate alert incidents. Since data has the potential to come in too late to be evaluated, New Relic has added two new streaming aggregation methods for NRQL alert conditions. With this addition, users have three options to choose from for data aggregation methods:

- Event Flow (the new default aggregation method)
- Event Timer (the other new aggregation method)
- Cadence (the classic aggregation method)

## Event Flow

Event Flow aggregation is best designed to be used for situations when data come in frequently and with low event spread, or mostly "in-order.” For every 1-minute processing window, there should be minimal difference between the earliest and least event timestamps.

Event Flow is the default data aggregation option because this method is more likely to result in fewer dropped data points due to latency in most situations, and decreased time-to-detect.

## Event Timer

Event Timer is designed to work best for data that comes infrequently and potentially in batches; for example, cloud integrations or error logs.

Event Time, as its namesake, has a Timer setting that starts counting down as soon as the first data point shows up for the aggregation window. It resets every time another data point arrives for that window.  

## Cadence

Cadence is the legacy data aggregation everyone has grown to know. For this data aggregation option each evaluation window waits exactly as long as the Delay setting is set for. A limitation of this option is that a certain amount of data may be dropped, as it comes in "too late" to be evaluated. This dropped data may trigger false alerts.

For further details on each use case, check out [this post](https://discuss.newrelic.com/t/relic-solution-how-can-i-figure-out-which-aggregation-method-to-use/164288).
