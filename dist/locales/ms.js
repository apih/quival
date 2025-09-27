/*!
 * quival v0.5.1 (https://github.com/apih/quival)
 * (c) 2023 Mohd Hafizuddin M Marzuki <hafizuddin_83@yahoo.com>
 * Released under the MIT License.
 */
this.quival = this.quival || {};
this.quival.locales = this.quival.locales || {};
this.quival.locales.ms = (function () {
  'use strict';

  var ms = {
    /**
     * Default error messages
     */
    accepted: 'Medan :attribute mesti diterima.',
    accepted_if: 'Medan :attribute mesti diterima apabila :other ialah :value.',
    active_url: 'Medan :attribute mesti URL yang sah.',
    after: 'Medan :attribute mesti tarikh selepas :date.',
    after_or_equal: 'Medan :attribute mesti tarikh selepas atau sama dengan :date.',
    alpha: 'Medan :attribute hanya boleh mengandungi huruf.',
    alpha_dash: 'Medan :attribute hanya boleh mengandungi huruf, nombor, tanda sengkang, dan garis bawah.',
    alpha_num: 'Medan :attribute hanya boleh mengandungi huruf dan nombor.',
    array: 'Medan :attribute mesti jujukan.',
    ascii: 'Medan :attribute hanya boleh mengandungi abjad, angka dan simbol berjenis bait tunggal.',
    before: 'Medan :attribute mesti tarikh sebelum :date.',
    before_or_equal: 'Medan :attribute mesti tarikh sebelum atau sama dengan :date.',
    between: {
      array: 'Medan :attribute mesti mempunyai antara :min dan :max item.',
      file: 'Medan :attribute mesti antara :min dan :max kilobait.',
      numeric: 'Medan :attribute mesti antara :min dan :max.',
      string: 'Medan :attribute mesti antara :min dan :max huruf.',
    },
    boolean: 'Medan :attribute mesti benar atau salah.',
    can: 'Medan :attribute field mengandungi nilai yang tidak dibenarkan.',
    confirmed: 'Pengesahan medan :attribute tidak sepadan.',
    contains: 'Medan :attribute tiada nilai yang diperlukan.',
    current_password: 'Kata laluan tidak sah.',
    date: 'Medan :attribute mesti tarikh yang sah.',
    date_equals: 'Medan :attribute mesti bersamaan dengan :date.',
    date_format: 'Medan :attribute mesti sepadan dengan format :format.',
    decimal: 'Medan :attribute mesti mempunyai :decimal tempat perpuluhan.',
    declined: 'Medan :attribute mesti ditolak.',
    declined_if: 'Medan :attribute mesti ditolak apabila :other adalah :value.',
    different: 'Medan :attribute dan :other mesti berbeza.',
    digits: 'Medan :attribute mesti mengandungi :digits digit.',
    digits_between: 'Medan :attribute mesti mengandungi antara :min dan :max digit.',
    dimensions: 'Medan :attribute mempunyai dimensi imej yang tidak sah.',
    distinct: 'Medan :attribute mempunyai nilai yang berulang.',
    doesnt_contain: 'Medan :attribute tidak boleh mengandungi salah satu daripada berikut: :values.',
    doesnt_end_with: 'Medan :attribute tidak boleh berakhir dengan salah satu daripada berikut: :values.',
    doesnt_start_with: 'Medan :attribute tidak boleh bermula dengan salah satu daripada berikut: :values.',
    email: 'Medan :attribute mesti alamat emel yang sah.',
    ends_with: 'Medan :attribute mesti berakhir dengan salah satu daripada berikut: :values.',
    enum: 'Nilai :attribute yang dipilih tidak sah.',
    exists: 'Nilai :attribute yang dipilih tidak sah.',
    extensions: 'Medan :attribute mesti salah satu daripada sambungan berikut: :values.',
    file: 'Medan :attribute mesti fail.',
    filled: 'Medan :attribute mesti mempunyai nilai.',
    gt: {
      array: 'Medan :attribute mesti mempunyai lebih daripada :value item.',
      file: 'Medan :attribute mesti lebih besar daripada :value kilobait.',
      numeric: 'Medan :attribute mesti lebih besar daripada :value.',
      string: 'Medan :attribute mesti lebih besar daripada :value huruf.',
    },
    gte: {
      array: 'Medan :attribute mesti mempunyai :value item atau lebih.',
      file: 'Medan :attribute mesti lebih besar daripada atau sama dengan :value kilobait.',
      numeric: 'Medan :attribute mesti lebih besar daripada atau sama dengan :value.',
      string: 'Medan :attribute mesti lebih besar daripada atau sama dengan :value huruf.',
    },
    hex_color: 'Medan :attribute mesti warna heksadesimal yang sah.',
    image: 'Medan :attribute mesti imej.',
    in: 'Nilai :attribute yang dipilih tidak sah.',
    in_array: 'Medan :attribute mesti wujud dalam :other.',
    integer: 'Medan :attribute mesti nombor bulat.',
    ip: 'Medan :attribute mesti alamat IP yang sah.',
    ipv4: 'Medan :attribute mesti alamat IPv4 yang sah.',
    ipv6: 'Medan :attribute mesti alamat IPv6 yang sah.',
    json: 'Medan :attribute mesti rentetan JSON yang sah.',
    list: 'Medan :attribute mesti berbentuk senarai.',
    lowercase: 'Medan :attribute mesti dalam huruf kecil.',
    lt: {
      array: 'Medan :attribute mesti mempunyai kurang daripada :value item.',
      file: 'Medan :attribute mesti kurang daripada :value kilobait.',
      numeric: 'Medan :attribute mesti kurang daripada :value.',
      string: 'Medan :attribute mesti kurang daripada :value huruf.',
    },
    lte: {
      array: 'Medan :attribute tidak boleh mempunyai lebih daripada :value item.',
      file: 'Medan :attribute mesti kurang daripada atau sama dengan :value kilobait.',
      numeric: 'Medan :attribute mesti kurang daripada atau sama dengan :value.',
      string: 'Medan :attribute mesti kurang daripada atau sama dengan :value huruf.',
    },
    mac_address: 'Medan :attribute mesti alamat MAC yang sah.',
    max: {
      array: 'Medan :attribute tidak boleh mempunyai lebih daripada :max item.',
      file: 'Medan :attribute tidak boleh lebih besar daripada :max kilobait.',
      numeric: 'Medan :attribute tidak boleh melebihi :max.',
      string: 'Medan :attribute tidak boleh melebihi :max huruf.',
    },
    max_digits: 'Medan :attribute tidak boleh mempunyai lebih daripada :max digit.',
    mimes: 'Medan :attribute mesti jenis fail: :values.',
    mimetypes: 'Medan :attribute mesti jenis fail: :values.',
    min: {
      array: 'Medan :attribute mesti mempunyai sekurang-kurangnya :min item.',
      file: 'Medan :attribute mesti sekurang-kurangnya :min kilobait.',
      numeric: 'Medan :attribute mesti sekurang-kurangnya :min.',
      string: 'Medan :attribute mesti sekurang-kurangnya :min huruf.',
    },
    min_digits: 'Medan :attribute mesti mempunyai sekurang-kurangnya :min digit.',
    missing: 'Medan :attribute mesti tiada.',
    missing_if: 'Medan :attribute mesti tiada apabila :other adalah :value.',
    missing_unless: 'Medan :attribute mesti tiada kecuali :other adalah :value.',
    missing_with: 'Medan :attribute mesti tiada apabila :values wujud.',
    missing_with_all: 'Medan :attribute mesti tiada apabila :values wujud.',
    multiple_of: 'Medan :attribute mesti gandaan :value.',
    not_in: 'Nilai :attribute yang dipilih tidak sah.',
    not_regex: 'Format medan :attribute tidak sah.',
    numeric: 'Medan :attribute mesti nombor.',
    password: {
      letters: 'Medan :attribute mesti mengandungi sekurang-kurangnya satu huruf.',
      mixed: 'Medan :attribute mesti mengandungi sekurang-kurangnya satu huruf besar dan satu huruf kecil.',
      numbers: 'Medan :attribute mesti mengandungi sekurang-kurangnya satu nombor.',
      symbols: 'Medan :attribute mesti mengandungi sekurang-kurangnya satu simbol.',
      uncompromised: 'Nilai :attribute yang diberikan telah muncul dalam kebocoran data. Sila pilih :attribute yang berbeza.',
    },
    present: 'Medan :attribute mesti wujud.',
    prohibited: 'Medan :attribute dilarang.',
    prohibited_if: 'Medan :attribute dilarang apabila :other adalah :value.',
    prohibited_unless: 'Medan :attribute dilarang melainkan :other berada dalam :values.',
    prohibits: 'Medan :attribute melarang :other daripada wujud.',
    regex: 'Format medan :attribute tidak sah.',
    required: 'Medan :attribute diperlukan.',
    required_array_keys: 'Medan :attribute mesti mengandungi entri untuk: :values.',
    required_if: 'Medan :attribute diperlukan apabila :other adalah :value.',
    required_if_accepted: 'Medan :attribute diperlukan apabila :other diterima.',
    required_if_declined: 'Medan :attribute diperlukan apabila :other ditolak.',
    required_unless: 'Medan :attribute diperlukan melainkan :other berada dalam :values.',
    required_with: 'Medan :attribute diperlukan apabila :values wujud.',
    required_with_all: 'Medan :attribute diperlukan apabila semua :values wujud.',
    required_without: 'Medan :attribute diperlukan apabila :values tidak wujud.',
    required_without_all: 'Medan :attribute diperlukan apabila tiada satu pun daripada :values wujud.',
    same: 'Medan :attribute mesti sepadan dengan :other.',
    size: {
      array: 'Medan :attribute mesti mengandungi :size item.',
      file: 'Medan :attribute mesti :size kilobait.',
      numeric: 'Medan :attribute mesti :size.',
      string: 'Medan :attribute mesti :size huruf.',
    },
    starts_with: 'Medan :attribute mesti bermula dengan salah satu dari berikut: :values.',
    string: 'Medan :attribute mesti perkataan / rentetan aksara.',
    timezone: 'Medan :attribute mesti zon masa yang sah.',
    unique: 'Medan :attribute telah wujud.',
    uploaded: 'Medan :attribute gagal dimuat naik.',
    uppercase: 'Medan :attribute mesti dalam huruf besar.',
    url: 'Medan :attribute mesti URL yang sah.',
    ulid: 'Medan :attribute mesti ULID yang sah.',
    uuid: 'Medan :attribute mesti UUID yang sah.',

    /**
     * Custom error messages
     */
    custom: {
      'attribute-name': {
        'rule-name': 'custom-message',
      },
    },

    /**
     * Custom attributes
     */
    attributes: {},

    /**
     * Custom values
     */
    values: {},
  };

  return ms;

})();
