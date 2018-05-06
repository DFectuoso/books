# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.6.1] - 2018-05-06

### Added
- Added seed data task
- Improve formatter on base table columns to allow `user.name` as property
- Added title change on header on PageComponent enter
- Added title support from env vars on server and react
- Query params to make filter functionality easier on list routers
- Added csv exports to ListPageComponents when `exportFormatter` function is present
- Added breadcrumbs component to lib
- Added breadcrumbs functionality to PageComponent

### Changed
- Updated Role, Organization and Group list pages to use ListPageComponent
- Updated Role, Organization and Group detials page to use PageComponent

### Fixed
- Mongoose models need `usePushEach: true` on all models with array attributes to prevent `Unknown modifier: $pushAll` error
- Fix table totals reduce function

## [0.6.0] - 2018-03-19
### Added
- Page component
- List page component with custom headers and support for selectable

### Changed
- Change name on branched-paginadedTable to branched-paginaded-table
- Changed user details, user list and user deleted list to use Page component and List page component
- Added selectable prop to branched-paginaded-table with onSelectChange to listen for changes

### Fixed
- Fix bug on page change within the same page component. Didn't do a reload.

