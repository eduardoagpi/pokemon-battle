import 'package:equatable/equatable.dart';

enum SettingsStatus { initial, loading, loaded, failure }

class SettingsState extends Equatable {
  final SettingsStatus status;
  final String baseUrlPath;
  final String? errorMessage;

  const SettingsState({
    this.status = SettingsStatus.initial,
    this.baseUrlPath = '',
    this.errorMessage,
  });

  SettingsState copyWith({
    SettingsStatus? status,
    String? baseUrlPath,
    String? errorMessage,
  }) {
    return SettingsState(
      status: status ?? this.status,
      baseUrlPath: baseUrlPath ?? this.baseUrlPath,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, baseUrlPath, errorMessage];
}
