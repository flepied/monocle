import React from 'react';

import { connect } from 'react-redux';
import { query } from '../reducers/query'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import {
  BaseQueryComponent,
  LoadingBox,
} from './common'

import { Line } from 'react-chartjs-2';


class ChangeReviewEventsHisto extends React.Component {
  prepare_data_set(histos) {
    const event_name_mapping = {
      ChangeCommentedEvent: {
        label: 'Changes commented',
        pointBorderColor: 'rgba(247,242,141,1)',
        pointBackgroundColor: '#fff',
        backgroundColor: 'rgba(247,242,141,0.4)',
        borderColor: 'rgba(247,242,141,1)',
      },
      ChangeReviewedEvent: {
        label: 'Changes reviewed',
        pointBorderColor: 'rgba(247,141,141,1)',
        pointBackgroundColor: '#fff',
        backgroundColor: 'rgba(247,141,141,0.4)',
        borderColor: 'rgba(247,141,141,1)',
      },
    }
    const _histos = Object.entries(histos)
    let data = {
      labels: histos['ChangeCommentedEvent'][0].map(x => x.key_as_string),
      datasets: []
    }
    _histos.forEach(histo => {
      data.datasets.push(
        {
          label: event_name_mapping[histo[0]].label,
          data: histo[1][0].map(x => x.doc_count),
          lineTension: 0.5,
          pointBorderColor: event_name_mapping[histo[0]].pointBorderColor,
          pointBackgroundColor: event_name_mapping[histo[0]].pointBackgroundColor,
          backgroundColor: event_name_mapping[histo[0]].backgroundColor,
          borderColor: event_name_mapping[histo[0]].borderColor,
        }
      )
    });
    return data
  }
  render() {
    const data = this.prepare_data_set(this.props.data)
    return (
      <Row>
        {/* <Col md={{ span: 8, offset: 2 }}> */}
        <Col>
          <Card>
            <Card.Body>
              <Line
                data={data}
                width={100}
                height={50}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }
}

class ChangesReviewStats extends BaseQueryComponent {
  componentDidUpdate(prevProps) {
    this.queryBackend(
      prevProps,
      'changes_review_stats',
      'changes_review_stats',
      this.props.handleQuery)
  }
  render() {
    if (!this.props.changes_review_stats_loading) {
      const data = this.props.changes_review_stats_result
      return (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>Changes review stats</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <ListGroup>
                      <ListGroup.Item>
                        {data.ChangeCommentedEvent.events_count} changes commented by {data.ChangeCommentedEvent.authors_count} authors
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {data.ChangeReviewedEvent.events_count} changes reviewed by {data.ChangeReviewedEvent.authors_count} authors
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Average delay for the first comment:{' '}
                        {data.first_event_delay.comment.first_event_delay_avg} secs
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Average delay for the first review:{' '}
                        {data.first_event_delay.review.first_event_delay_avg} secs
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={8}>
                    <ChangeReviewEventsHisto
                      data={data.histos}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )
    } else {
      return <LoadingBox />
    }
  }
}

const mapStateToProps = state => {
  return {
    filter_loaded_from_url: state.FiltersReducer.filter_loaded_from_url,
    filter_gte: state.FiltersReducer.filter_gte,
    filter_lte: state.FiltersReducer.filter_lte,
    filter_repository: state.FiltersReducer.filter_repository,
    filter_interval: state.FiltersReducer.filter_interval,
    filter_exclude_authors: state.FiltersReducer.filter_exclude_authors,
    filter_authors: state.FiltersReducer.filter_authors,
    changes_review_stats_loading: state.QueryReducer.changes_review_stats_loading,
    changes_review_stats_result: state.QueryReducer.changes_review_stats_result,
    changes_review_stats_error: state.QueryReducer.changes_review_stats_error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleQuery: (params) => dispatch(query(params)),
  }
}

const CChangesReviewStats = connect(mapStateToProps, mapDispatchToProps)(ChangesReviewStats);

export {
  CChangesReviewStats,
}
