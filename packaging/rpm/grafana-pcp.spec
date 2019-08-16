Name:           grafana-pcp
Version:        0.0.7
Release:        1%{?dist}
Summary:        PCP Grafana Application

%global         github https://github.com/performancecopilot/grafana-pcp
%global         install_dir %{_sharedstatedir}/grafana/plugins/pcp
%global         _debugsource_template %{nil} # avoid empty debugsourcefiles.list

BuildArch:      noarch
ExclusiveArch:  %{nodejs_arches}

License:        ASL 2.0
URL:            %{github}

Source0:        %{github}/archive/v%{version}/%{name}-%{version}.tar.gz

Requires:       pcp >= 4.3.4
Requires:       grafana >= 6.2.2
Suggests:       redis >= 5.0.4

Obsoletes:      grafana-pcp-datasource
Obsoletes:      grafana-pcp-redis

%description
Native Performance Co-Pilot application plugin for Grafana with datasources
for pmseries, live metrics and the bpftrace PMDA, and several example dashboards.

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

%license LICENSE NOTICE
%doc README.md

%changelog
* Fri Aug 16 2019 Andreas Gerstmayr <agerstmayr@redhat.com> 0.0.7-1
- converted into a Grafana app plugin, renamed to grafana-pcp
- redis: support for instance domains, labels, autocompletion, automatic rate conversation
- live and bpftrace: initial commit of datasources

* Tue Jun 11 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.6-1
- renamed package to grafana-pcp-redis, updated README, etc

* Wed Jun 05 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.5-1
- renamed package to grafana-pcp-datasource, README, etc

* Fri May 17 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.4-1
- add suggested pmproxy URL in config html
- updated instructions and README.md now that grafana is in Fedora

* Fri Apr 12 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.3-1
- require grafana v6.1.3 or later
- install directory is now below /var/lib/grafana/plugins

* Wed Mar 20 2019 Mark Goodwin <mgoodwin@redhat.com> 0.0.2-1
- initial version
