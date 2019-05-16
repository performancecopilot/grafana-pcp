Name:           pcp-grafana-datasource
Version:        0.0.3
Release:        1%{?dist}
Summary:        PCP Grafana Data Source Plugin

%global         github https://github.com/performancecopilot
%global         install_dir %{_sharedstatedir}/grafana/plugins/pcp
%global         _debugsource_template %{nil} # avoid empty debugsourcefiles.list

BuildArch:      noarch
ExclusiveArch:  %{nodejs_arches}

License:        GPLv2+ and MIT
URL:            %{github}/pcp-grafana-datasource
Source0:        https://github.com/performancecopilot/pcp-grafana-datasource/archive/v%{version}/%{name}-%{version}.src.tar.gz

Requires:       pcp >= 4.3.2
Requires:       grafana >= 6.1.3

%description
Native PCP data source plugin for Grafana.


%prep
%setup -q


%build
echo 'Grafana plugins are always pre-built in the "dist" directory'
[ -f dist/module.js.map ] || exit 1 # fail

%install
install -d -m 755 %{buildroot}/%{install_dir}
cp -a dist/* %{buildroot}/%{install_dir}

%files
%{install_dir}

%license LICENSE
%doc README.md

%changelog
* Fri Apr 12 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.3-1
- require grafana v6.1.3 or later
- install directory is now below /var/lib/grafana/plugins

* Wed Mar 20 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.2-1
- initial version
