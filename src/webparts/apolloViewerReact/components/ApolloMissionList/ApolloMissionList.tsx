import * as React from 'react';

import {
  List,
  TagPicker,
  Toggle
} from "office-ui-fabric-react";

import { IMission } from '../../../../models';
import { ApolloMission } from '../ApolloMission';
import {
  IApolloMissionListProps,
  IApolloMissionListState
} from './';

interface IMissionTagPickerItem {
  key: string,
  name: string,
  mission: IMission
};

export class ApolloMissionList extends React.Component<IApolloMissionListProps, IApolloMissionListState> {

  public constructor(props: IApolloMissionListProps) {
    super(props);

    this.state = {
      filteredMissions: [],
      showAllMissions: false
    };
  }

  /**
   * React lifecycle event raised when the properties on the component are changing.
   */
  public getDerivedStateFromProps(newProps: IApolloMissionListProps): void {
    const newFilteredList: IMission[] = [];
    // loop through all filtered items and see if it's in the array
    this.state.filteredMissions.forEach((filteredMission) => {
      if (newProps.missions.indexOf(filteredMission) >= 0) {
        newFilteredList.push(filteredMission);
      }
    });
    // set the state to new filtered list
    this.setState({ filteredMissions: newFilteredList });
  }

  public render(): React.ReactElement<IApolloMissionListProps> {

    return (
      <div>
        <Toggle
          label='Show all or filtered missions?'
          onText='showing all missions'
          offText='showing selected missions'
          checked={this.state.showAllMissions}
          onChanged={this._onPickerToggleChanged}
        />
        <TagPicker
          disabled={this.state.showAllMissions}
          pickerSuggestionsProps={
            {
              suggestionsHeaderText: 'Suggested Apollo missions...',
              noResultsFoundText: 'No matching Apollo missions found'
            }
          }
          onChange={this._onSelectedItemsChanged}
          onResolveSuggestions={this._onFilterChanged}
        />
        <List
          items={this._missionsToShow}
          onRenderCell={this._onRenderCell}
        />
      </div>
    );

  }

  /**
   * Handler for TagPicker component when resolving suggestions for the picker based on user input.
   *
   * @private
   * @memberof ApolloMissionList
   */
  private _onFilterChanged = (filterText: string, tagList: { key: string, name: string, mission: IMission }[]): { key: string, name: string, mission: IMission }[] => {
    // get list of all matching missions with the same ID / mission name
    const filteredMissions: IMission[] = this.props.missions.filter(mission => {
      if (
        (mission.id.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
        || (mission.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
      ) {
        return mission;
      }
    });

    // return as an array of keys & names
    return filteredMissions.map(mission => ({
      key: this._getMissionUniqueId(mission),
      name: `(${mission.id}) ${mission.name}`,
      mission: mission
    }));
  }

  private _onSelectedItemsChanged = (items: IMissionTagPickerItem[]): void => {
    const filteredMissions: IMission[] = items.map(item => item.mission);

    this.setState((prevState: IApolloMissionListState) => {
      const newState: IApolloMissionListState = {
        showAllMissions: prevState.showAllMissions,
        filteredMissions: filteredMissions
      };
      return newState;
    });
  }

  private _onRenderCell = (mission: IMission, index: number | undefined): JSX.Element => {
    return (
      <ApolloMission key={this._getMissionUniqueId(mission)}
        mission={mission}
        onRemoveMission={this.props.onDeleteMission} />
    );
  }

  private get _missionsToShow(): IMission[] {
    return this.state.showAllMissions
      ? this.props.missions
      : this.state.filteredMissions;
  }

  private _onPickerToggleChanged = (checked: boolean): void => {
    this.setState({ showAllMissions: checked });
  }

  /**
   * Generate a unique ID for the element to help React uniquely identify each element.
   *
   * @private
   * @param {IMission} mission    The mission to generate the unique ID for.
   * @returns {string}            Unique ID for the mission.
   * @memberof ApolloMissionList
   */
  private _getMissionUniqueId(mission: IMission): string {
    return (`${mission.id}|${mission.name.replace(' ', '_')}`).toLowerCase();
  }

}
