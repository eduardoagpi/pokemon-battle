import 'package:equatable/equatable.dart';

abstract class SettingsEvent extends Equatable {
  const SettingsEvent();

  @override
  List<Object> get props => [];
}

class LoadSettings extends SettingsEvent {
  const LoadSettings();
}

class UpdateBaseUrl extends SettingsEvent {
  final String baseUrl;
  const UpdateBaseUrl(this.baseUrl);

  @override
  List<Object> get props => [baseUrl];
}
