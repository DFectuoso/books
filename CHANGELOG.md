# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


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

