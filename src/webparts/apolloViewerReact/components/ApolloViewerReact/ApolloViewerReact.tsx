import * as React from 'react';
import styles from '../ApolloViewerReact.module.scss';
import {
  ApolloMissionList,
  IApolloViewerReactProps,
  IApolloViewerReactState
} from '../';

import { IMission } from '../../../../models';
import { MissionService } from '../../../../services';

export class ApolloViewerReact extends React.Component<IApolloViewerReactProps, IApolloViewerReactState> {

  public constructor(props: IApolloViewerReactProps) {
    super(props);

    // init the state to empty
    this.state = {
      missions: []
    };

    // because our event handler needs access to the component, bind
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    this._removeMission = this._removeMission.bind(this);
  }

  /**
   * OOTB React lifecycle event that fires after the component has been mounted.
   * This is the ideal spot to load data on rendering.
   *
   * @see {@link https://reactjs.org/docs/react-component.html#componentdidmount|React Docs - componentDidMount()}
   * @memberof ApolloViewerReact
   */
  public componentDidMount(): void {
    this.setState({
      missions: MissionService.getMissions()
    });
  }

  public render(): React.ReactElement<IApolloViewerReactProps> {
    return (
      <section className={`${styles.apolloViewerReact} ${this.props.hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <h2>Apollo Mission Viewer (React)</h2>
          <ApolloMissionList missions={ this.state.missions } onDeleteMission={ this._removeMission } />
        </div>
      </section>
    );
  }

  /**
   * Removes the specified mission from the state. This triggers an update to rendering.
   *
   * @private
   * @param {IMission} missionToRemove
   * @memberof ApolloViewerReact
   */
  private _removeMission(missionToRemove: IMission): void {
    const newMissions: IMission[] = this.state.missions.filter(mission => mission !== missionToRemove);

    this.setState({ missions: newMissions });
  }

}
