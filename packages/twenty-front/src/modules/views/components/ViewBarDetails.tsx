import styled from '@emotion/styled';
import { ReactNode, useMemo } from 'react';

import { useObjectNameSingularFromPlural } from '@/object-metadata/hooks/useObjectNameSingularFromPlural';
import { AddObjectFilterFromDetailsButton } from '@/object-record/object-filter-dropdown/components/AddObjectFilterFromDetailsButton';
import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { useHandleToggleTrashColumnFilter } from '@/object-record/record-index/hooks/useHandleToggleTrashColumnFilter';
import { DropdownScope } from '@/ui/layout/dropdown/scopes/DropdownScope';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { AdvancedFilterDropdownButton } from '@/views/components/AdvancedFilterDropdownButton';
import { EditableFilterDropdownButton } from '@/views/components/EditableFilterDropdownButton';
import { EditableSortChip } from '@/views/components/EditableSortChip';
import { ViewBarFilterEffect } from '@/views/components/ViewBarFilterEffect';
import { useViewFromQueryParams } from '@/views/hooks/internal/useViewFromQueryParams';

import { useCheckIsSoftDeleteFilter } from '@/object-record/record-filter/hooks/useCheckIsSoftDeleteFilter';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { currentRecordSortsComponentState } from '@/object-record/record-sort/states/currentRecordSortsComponentState';
import { SoftDeleteFilterChip } from '@/views/components/SoftDeleteFilterChip';
import { useApplyCurrentViewFiltersToCurrentRecordFilters } from '@/views/hooks/useApplyCurrentViewFiltersToCurrentRecordFilters';
import { useApplyCurrentViewSortsToCurrentRecordSorts } from '@/views/hooks/useApplyCurrentViewSortsToCurrentRecordSorts';
import { useAreViewFiltersDifferentFromRecordFilters } from '@/views/hooks/useAreViewFiltersDifferentFromRecordFilters';
import { useAreViewSortsDifferentFromRecordSorts } from '@/views/hooks/useAreViewSortsDifferentFromRecordSorts';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { useResetUnsavedViewStates } from '@/views/hooks/useResetUnsavedViewStates';

import { isViewBarExpandedComponentState } from '@/views/states/isViewBarExpandedComponentState';
import { isNonEmptyArray } from '@sniptt/guards';
import { isDefined } from 'twenty-shared';
import { t } from '@lingui/core/macro';

export type ViewBarDetailsProps = {
  hasFilterButton?: boolean;
  rightComponent?: ReactNode;
  filterDropdownId?: string;
  viewBarId: string;
  objectNamePlural: string;
};

const StyledBar = styled.div`
  align-items: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 32px;
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  z-index: 4;
`;

const StyledChipcontainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  gap: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(1)};
  z-index: 1;
`;

const StyledCancelButton = styled.button`
  background-color: inherit;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  user-select: none;
  margin-right: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${({ theme }) => theme.background.tertiary};
    border-radius: ${({ theme }) => theme.spacing(1)};
  }
`;

const StyledFilterContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow-x: hidden;
`;

const StyledSeperatorContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledSeperator = styled.div`
  align-self: stretch;
  background: ${({ theme }) => theme.background.quaternary};
  width: 1px;
`;

const StyledAddFilterContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing(1)};
  z-index: 5;
`;

export const ViewBarDetails = ({
  hasFilterButton = false,
  rightComponent,
  filterDropdownId,
  viewBarId,
  objectNamePlural,
}: ViewBarDetailsProps) => {
  const { currentViewWithCombinedFiltersAndSorts } = useGetCurrentView();

  const viewId = currentViewWithCombinedFiltersAndSorts?.id;

  const isViewBarExpanded = useRecoilComponentValueV2(
    isViewBarExpandedComponentState,
  );

  const { hasFiltersQueryParams } = useViewFromQueryParams();

  const currentRecordFilters = useRecoilComponentValueV2(
    currentRecordFiltersComponentState,
  );

  const currentRecordSorts = useRecoilComponentValueV2(
    currentRecordSortsComponentState,
  );

  const { objectNameSingular } = useObjectNameSingularFromPlural({
    objectNamePlural: objectNamePlural,
  });
  const { toggleSoftDeleteFilterState } = useHandleToggleTrashColumnFilter({
    objectNameSingular: objectNameSingular,
    viewBarId: viewBarId,
  });
  const { resetUnsavedViewStates } = useResetUnsavedViewStates();

  const { viewFiltersAreDifferentFromRecordFilters } =
    useAreViewFiltersDifferentFromRecordFilters();

  const { viewSortsAreDifferentFromRecordSorts } =
    useAreViewSortsDifferentFromRecordSorts();

  const canResetView =
    (viewFiltersAreDifferentFromRecordFilters ||
      viewSortsAreDifferentFromRecordSorts) &&
    !hasFiltersQueryParams;

  const { checkIsSoftDeleteFilter } = useCheckIsSoftDeleteFilter();

  const softDeleteFilter = currentRecordFilters.find((recordFilter) =>
    checkIsSoftDeleteFilter(recordFilter),
  );

  const recordFilters = useMemo(() => {
    return currentRecordFilters.filter(
      (recordFilter) =>
        !recordFilter.viewFilterGroupId &&
        !checkIsSoftDeleteFilter(recordFilter),
    );
  }, [currentRecordFilters, checkIsSoftDeleteFilter]);

  const { applyCurrentViewFiltersToCurrentRecordFilters } =
    useApplyCurrentViewFiltersToCurrentRecordFilters();

  const { applyCurrentViewSortsToCurrentRecordSorts } =
    useApplyCurrentViewSortsToCurrentRecordSorts();

  const handleCancelClick = () => {
    if (isDefined(viewId)) {
      resetUnsavedViewStates(viewId);
      applyCurrentViewFiltersToCurrentRecordFilters();
      applyCurrentViewSortsToCurrentRecordSorts();
      toggleSoftDeleteFilterState(false);
    }
  };

  const shouldExpandViewBar =
    viewFiltersAreDifferentFromRecordFilters ||
    ((currentViewWithCombinedFiltersAndSorts?.viewSorts?.length ||
      currentRecordFilters?.length) &&
      isViewBarExpanded);

  if (!shouldExpandViewBar) {
    return null;
  }

  const showAdvancedFilterDropdownButton =
    currentViewWithCombinedFiltersAndSorts?.viewFilterGroups &&
    currentViewWithCombinedFiltersAndSorts?.viewFilterGroups.length > 0;

  return (
    <StyledBar>
      <StyledFilterContainer>
        <StyledChipcontainer>
          {isDefined(softDeleteFilter) && (
            <SoftDeleteFilterChip
              key={softDeleteFilter.fieldMetadataId}
              recordFilter={softDeleteFilter}
              viewBarId={viewBarId}
            />
          )}
          {isDefined(softDeleteFilter) && (
            <StyledSeperatorContainer>
              <StyledSeperator />
            </StyledSeperatorContainer>
          )}
          {currentRecordSorts.map((recordSort) => (
            <EditableSortChip
              key={recordSort.fieldMetadataId}
              recordSort={recordSort}
            />
          ))}
          {isNonEmptyArray(recordFilters) &&
            isNonEmptyArray(currentRecordSorts) && (
              <StyledSeperatorContainer>
                <StyledSeperator />
              </StyledSeperatorContainer>
            )}
          {showAdvancedFilterDropdownButton && <AdvancedFilterDropdownButton />}
          {recordFilters.map((recordFilter) => (
            <ObjectFilterDropdownComponentInstanceContext.Provider
              key={recordFilter.id}
              value={{ instanceId: recordFilter.id }}
            >
              <DropdownScope dropdownScopeId={recordFilter.id}>
                <ViewBarFilterEffect filterDropdownId={recordFilter.id} />
                <EditableFilterDropdownButton
                  viewFilter={recordFilter}
                  hotkeyScope={{
                    scope: recordFilter.id,
                  }}
                  viewFilterDropdownId={recordFilter.id}
                />
              </DropdownScope>
            </ObjectFilterDropdownComponentInstanceContext.Provider>
          ))}
        </StyledChipcontainer>
        {hasFilterButton && (
          <StyledAddFilterContainer>
            <AddObjectFilterFromDetailsButton
              filterDropdownId={filterDropdownId}
            />
          </StyledAddFilterContainer>
        )}
      </StyledFilterContainer>
      {canResetView && (
        <StyledCancelButton
          data-testid="cancel-button"
          onClick={handleCancelClick}
        >
          {t`Reset`}
        </StyledCancelButton>
      )}
      {rightComponent}
    </StyledBar>
  );
};
